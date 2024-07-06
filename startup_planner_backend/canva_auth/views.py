from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth import get_user_model, login
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from .models import OAuthState
import requests
import hashlib
import base64
import os
import uuid
import logging
from datetime import timedelta
from dotenv import load_dotenv
from urllib.parse import urlencode
import resend

# Load environment variables from .env file
load_dotenv()

# Get the User model
User = get_user_model()

# Configure logging
logger = logging.getLogger(__name__)

# Set the Resend API key
resend.api_key = os.getenv("RESEND_API_KEY")


@api_view(['GET'])
@permission_classes([AllowAny])
def canva_auth(request):
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    state = generate_state()

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


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def canva_callback(request):
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
        logger.error('Failed to exchange authorization code for access token')
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
    return redirect(dashboard_url)


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_us(request):
    name = request.data.get('name')
    email = request.data.get('email')
    message = request.data.get('message')

    if not all([name, email, message]):
        return Response({'error': 'Missing name, email, or message'}, status=status.HTTP_400_BAD_REQUEST)

    params = {
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    if request.user.is_authenticated:
        return Response({'isAuthenticated': True})
    else:
        return Response({'isAuthenticated': False}, status=401)


def generate_code_verifier() -> str:
    return base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8').rstrip('=')


def generate_code_challenge(code_verifier: str) -> str:
    code_challenge_digest = hashlib.sha256(
        code_verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(code_challenge_digest).decode('utf-8').rstrip('=')


def generate_state() -> str:
    return base64.urlsafe_b64encode(os.urandom(16)).decode('utf-8').rstrip('=')

