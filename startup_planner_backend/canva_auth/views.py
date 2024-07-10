from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model, login, logout
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import OAuthState
import requests
import hashlib
import base64
import os
import uuid
import logging
from datetime import timedelta
from dotenv import load_dotenv
import resend
from urllib.parse import urlencode
from .serializers import AccountSerializer, BillingSerializer, SecuritySerializer
from .models import BillingInfo
from .utils import upload_to_vercel_blob
from django.http import HttpResponseRedirect
# Load environment variables from .env file
load_dotenv()

# Get the User model
User = get_user_model()

# Configure logging
logger = logging.getLogger(__name__)

# Set the Resend API key
resend.api_key = os.getenv("RESEND_API_KEY")


class CanvaAuthAPIView(APIView):
    """
    Handles the OAuth flow with Canva.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """
        Initiates the OAuth flow with Canva by redirecting to Canva's authorization URL.
        """
        code_verifier = self.generate_code_verifier()
        code_challenge = self.generate_code_challenge(code_verifier)
        state = self.generate_state()

        OAuthState.objects.create(state=state, code_verifier=code_verifier)
        logger.debug(
            f'Session saved with state: {state} and code_verifier: {code_verifier}')

        params = {
            'response_type': 'code',
            'client_id': settings.CANVA_CLIENT_ID,
            'redirect_uri': settings.CANVA_REDIRECT_URI,
            'scope': 'asset:read asset:write design:content:read design:content:write design:meta:read profile:read',
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256',
            'state': state
        }

        auth_url = f"https://www.canva.com/api/oauth/authorize?{urlencode(params)}"
        return redirect(auth_url)

    @staticmethod
    def generate_code_verifier() -> str:
        """
        Generates a secure random string for the code verifier.
        """
        return base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8').rstrip('=')

    @staticmethod
    def generate_code_challenge(code_verifier: str) -> str:
        """
        Generates a code challenge based on the code verifier.
        """
        code_challenge_digest = hashlib.sha256(
            code_verifier.encode('utf-8')).digest()
        return base64.urlsafe_b64encode(code_challenge_digest).decode('utf-8').rstrip('=')

    @staticmethod
    def generate_state() -> str:
        """
        Generates a secure random string for the state parameter.
        """
        return base64.urlsafe_b64encode(os.urandom(16)).decode('utf-8').rstrip('=')


@method_decorator(csrf_exempt, name='dispatch')
class CanvaCallbackAPIView(APIView):
    """
    Handles the OAuth callback from Canva.
    """
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """
        Handles the GET request from Canva with the authorization code and state.
        Exchanges the authorization code for access and refresh tokens.
        """
        code = request.GET.get('code')
        state = request.GET.get('state')

        if not code or not state:
            return Response({'error': 'Missing code or state parameter'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            oauth_state = OAuthState.objects.get(state=state)
        except OAuthState.DoesNotExist:
            logger.error(f'Invalid state parameter: {state}')
            return Response({'error': 'Invalid state parameter'}, status=status.HTTP_400_BAD_REQUEST)

        if oauth_state.is_expired():
            oauth_state.delete()
            logger.error(f'State parameter expired: {state}')
            return Response({'error': 'State parameter expired'}, status=status.HTTP_400_BAD_REQUEST)

        code_verifier = oauth_state.code_verifier
        oauth_state.delete()  # Clean up the state record

        token_url = 'https://api.canva.com/rest/v1/oauth/token'
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.CANVA_CLIENT_ID,
            'client_secret': settings.CANVA_CLIENT_SECRET,
            'code': code,
            'code_verifier': code_verifier,
            'redirect_uri': settings.CANVA_REDIRECT_URI,
        }

        response = requests.post(token_url, data=data, headers={
                                 'Content-Type': 'application/x-www-form-urlencoded'})

        if response.status_code != 200:
            logger.error(
                'Failed to exchange authorization code for access token')
            return Response({'error': 'Failed to exchange authorization code for access token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        tokens = response.json()
        access_token = tokens.get('access_token')
        refresh_token = tokens.get('refresh_token')
        expires_in = tokens.get('expires_in')

        user_info_url = 'https://api.canva.com/rest/v1/users/me'
        user_info_response = requests.get(
            user_info_url, headers={'Authorization': f'Bearer {access_token}'})

        if user_info_response.status_code != 200:
            logger.error('Failed to fetch user info from Canva')
            return Response({'error': 'Failed to fetch user info from Canva'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user_info = user_info_response.json()
        team_user = user_info.get('team_user', {})
        user_id = team_user.get('user_id', '')
        team_id = team_user.get('team_id', '')

        user_profile_url = 'https://api.canva.com/rest/v1/users/me/profile'
        user_profile_response = requests.get(user_profile_url, headers={
                                             'Authorization': f'Bearer {access_token}'})

        if user_profile_response.status_code != 200:
            logger.error('Failed to fetch user profile from Canva')
            return Response({'error': 'Failed to fetch user profile from Canva'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        display_name = user_profile_response.json().get('display_name', '')

        user, created = User.objects.update_or_create(
            canva_user_id=user_id,
            defaults={
                'display_name': display_name,
                'team_id': team_id,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_expiry': timezone.now() + timedelta(seconds=expires_in)
            }
        )

        login(request, user)
        dashboard_url = f"{settings.FRONTEND_URL}/dashboard"

        response = HttpResponseRedirect(dashboard_url)
        session_id = request.COOKIES.get('sessionid')
        csrf_token = request.COOKIES.get('csrftoken')

        response.set_cookie(
            'sessionid', session_id,
            domain=settings.SESSION_COOKIE_DOMAIN,
            samesite='None',
            secure=True,
            httponly=True
        )
        response.set_cookie(
            'csrftoken',
            csrf_token,
            domain=settings.CSRF_COOKIE_DOMAIN,
            samesite='None',
            secure=True
        )
        return response


class LogoutAPIView(APIView):
    """
    Handles logout functionality.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Logs out the authenticated user.
        """
        logout(request)
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)


class ContactUsAPIView(APIView):
    """
    Handles contact us form submissions.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Handles the POST request for the contact us form.
        Sends an email with the submitted details.
        """
        name = request.data.get('name')
        email = request.data.get('email')
        message = request.data.get('message')

        if not all([name, email, message]):
            return Response({'error': 'Missing name, email, or message'}, status=status.HTTP_400_BAD_REQUEST)

        params: resend.Emails.SendParams = {
            "from": "onboarding@resend.dev",
            "to": ["delivered@resend.dev"],
            "subject": f"Contact Us message from {name}",
            "html": f"<strong>{message}</strong><br><br>From: {name} &lt;{email}&gt;",
            "headers": {
                "X-Entity-Ref-ID": str(uuid.uuid4())
            },
        }

        try:
            email_response = resend.Emails.send(params)
            logger.debug(f'Email sent successfully: {email_response}')
        except Exception as e:
            logger.error(f'Failed to send email: {e}')
            return Response({'error': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'success': 'Email sent successfully'}, status=status.HTTP_200_OK)


class CheckAuthAPIView(APIView):
    """
    Checks if the user is authenticated.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Returns authentication status of the user.
        """
        if request.user.is_authenticated:
            return Response({'isAuthenticated': True})
        else:
            return Response({'isAuthenticated': False}, status=status.HTTP_401_UNAUTHORIZED)


class AccountView(APIView):
    """
    Handles account-related operations.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves the authenticated user's account details.
        """
        user = request.user
        serializer = AccountSerializer(user)
        data = serializer.data
        data._mutable = True
        data['is_first_time_login'] = user.is_first_time_login()
        data._mutable = False

        return Response(serializer.data)

    def put(self, request):
        """
        Updates the authenticated user's account details.
        Handles avatar upload to Vercel blob storage.
        """
        user = request.user
        file = request.FILES.get('avatar')

        if file:
            try:
                blob_url = upload_to_vercel_blob(file)
                request.data._mutable = True
                request.data['avatar'] = blob_url
                request.data._mutable = False
            except Exception as e:
                logger.error(f'Failed to upload avatar: {e}')
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AccountSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BillingView(APIView):
    """
    Handles billing information operations.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieves the authenticated user's billing information.
        """
        user = request.user
        billing_info, created = BillingInfo.objects.get_or_create(user=user)
        serializer = BillingSerializer(billing_info)
        return Response(serializer.data)

    def put(self, request):
        """
        Updates the authenticated user's billing information.
        """
        user = request.user
        billing_info, created = BillingInfo.objects.get_or_create(user=user)
        serializer = BillingSerializer(
            billing_info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Billing information updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SecurityView(APIView):
    """
    Handles security-related operations such as password changes.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """
        Updates the authenticated user's password.
        """
        serializer = SecuritySerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            request.user.set_password(
                serializer.validated_data['new_password'])
            request.user.save()
            return Response({"message": "Security settings updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
