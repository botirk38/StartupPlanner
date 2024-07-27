from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import OAuthState
import logging
from dotenv import load_dotenv
from urllib.parse import urlencode
from .serializers import (
    AccountSerializer,
    BillingSerializer,
    SecuritySerializer,
    UserRegistrationSerializer,
    UserLoginSerializer
)
from .services.auth_service import AuthService
from .services.user_service import UserService
from .services.canva_service import CanvaService
from .services.billing_service import BillingService
from django.contrib.auth import authenticate, login, logout, get_user_model

# Load environment variables from .env file
load_dotenv()

# Get the User model
User = get_user_model()

# Configure logging
logger = logging.getLogger(__name__)


class CanvaAuthAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        code_verifier, code_challenge, state = CanvaService.generate_oauth_params()
        OAuthState.objects.create(state=state, code_verifier=code_verifier)

        params = CanvaService.get_auth_params(code_challenge, state)
        auth_url = f"https://www.canva.com/api/oauth/authorize?{urlencode(params)}"
        return redirect(auth_url)


@method_decorator(csrf_exempt, name='dispatch')
class CanvaCallbackAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        state = request.GET.get('state')

        if not code or not state:
            return Response({'error': 'Missing code or state parameter'}, status=status.HTTP_400_BAD_REQUEST)

        oauth_state = CanvaService.validate_oauth_state(state)

        if not oauth_state:
            return Response({'error': 'Invalid or expired state parameter'}, status=status.HTTP_400_BAD_REQUEST)

        code_verifier = oauth_state.code_verifier
        oauth_state.delete()  # Clean up the state record

        tokens = CanvaService.exchange_code_for_tokens(code, code_verifier)
        if not tokens:
            return Response({'error': 'Failed to exchange authorization code for access token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        access_token = tokens.get('access_token')
        refresh_token = tokens.get('refresh_token')
        expires_in = tokens.get('expires_in')

        user_info = CanvaService.get_user_info(access_token)
        if not user_info:
            return Response({'error': 'Failed to fetch user info from Canva'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user_profile = CanvaService.get_user_profile(access_token)
        if not user_profile:
            return Response({'error': 'Failed to fetch user profile from Canva'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user = CanvaService.create_or_update_user(
            user_info, user_profile, access_token, refresh_token, expires_in)

        login(request, user)

        if user.is_first_time_login():
            return redirect(f"{settings.FRONTEND_URL}/business/create")
        return redirect(f"{settings.FRONTEND_URL}/dashboard")


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        return AuthService.register_user(request, serializer)


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            return AuthService.login_user(request, email, password)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        return AuthService.logout_user(request)


class CheckAuthAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({'isAuthenticated': True})


class AccountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return UserService.get_account_details(request.user, AccountSerializer)

    def put(self, request):
        return UserService.update_account_details(request.user, request.data, AccountSerializer)


class BillingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return BillingService.get_billing_info(request.user, BillingSerializer)

    def put(self, request):
        return BillingService.update_billing_info(request.user, request.data, BillingSerializer)


class SecurityView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        return UserService.update_security_settings(request.user, request.data, SecuritySerializer)
