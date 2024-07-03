import hashlib
import base64
import os
from urllib.parse import urlencode
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model, login
from django.utils import timezone
import requests
from datetime import timedelta
import logging
from .models import OAuthState

User = get_user_model()

logger = logging.getLogger(__name__)


def generate_code_verifier():
    return base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8').rstrip('=')


def generate_code_challenge(code_verifier):
    code_challenge_digest = hashlib.sha256(
        code_verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(code_challenge_digest).decode('utf-8').rstrip('=')


def generate_state():
    return base64.urlsafe_b64encode(os.urandom(16)).decode('utf-8').rstrip('=')


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
def canva_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')

    try:
        oauth_state = OAuthState.objects.get(state=state)
    except OAuthState.DoesNotExist:
        return JsonResponse({'error': 'Invalid state parameter'}, status=400)

    if oauth_state.is_expired():
        oauth_state.delete()
        return JsonResponse({'error': 'State parameter expired'}, status=400)

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
        return JsonResponse({'error': 'Failed to exchange authorization code for access token'}, status=500)

    tokens = response.json()
    access_token = tokens.get('access_token')
    refresh_token = tokens.get('refresh_token')
    expires_in = tokens.get('expires_in')

    # Fetch user info from Canva
    user_info_url = 'https://api.canva.com/rest/v1/users/me'
    user_info_response = requests.get(
        user_info_url, headers={'Authorization': f'Bearer {access_token}'})

    if user_info_response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch user info from Canva'}, status=500)

    user_info = user_info_response.json()
    team_user = user_info.get('team_user', {})
    user_id = team_user.get('user_id', '')
    team_id = team_user.get('team_id', '')

    user_profile_url = 'https://api.canva.com/rest/v1/users/me/profile'
    user_profile_response = requests.get(user_profile_url, headers={
                                         'Authorization': f"Bearer {access_token}"})

    if user_profile_response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch user profile from Canva'}, status=500)

    display_name = user_profile_response.json().get('display_name', '')

    # Create or update user
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

    # Log the user in
    login(request, user)

    # Redirect to dashboard or any other page
    return redirect('http://localhost:3000/dashboard')
