from typing import Optional
from django.contrib.auth import get_user_model
import requests
from django.conf import settings
import logging
from .utils import (
    generate_code_verifier,
    generate_code_challenge,
    generate_state)

from ..models import OAuthState
from datetime import timedelta
from django.utils import timezone
logger = logging.getLogger(__name__)
User = get_user_model()


class CanvaService:

    @staticmethod
    def generate_oauth_params() -> tuple[str, str, str]:
        code_verifier = generate_code_verifier()
        code_challenge = generate_code_challenge(code_verifier)
        state = generate_state()
        return code_verifier, code_challenge, state

    @staticmethod
    def get_auth_params(code_challenge: str, state: str) -> dict[str, str]:
        return {
            'response_type': 'code',
            'client_id': settings.CANVA_CLIENT_ID,
            'redirect_uri': settings.CANVA_REDIRECT_URI,
            'scope': 'asset:read asset:write design:content:read design:content:write design:meta:read profile:read',
            'state': state,
            'code_challenge': code_challenge,
            'code_challenge_method': 'S256',
        }

    @staticmethod
    def exchange_code_for_tokens(code: str, code_verifier: str) -> Optional[dict[str, any]]:
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
            return None
        return response.json()

    @staticmethod
    def get_user_info(access_token: str) -> Optional[dict[str, any]]:
        user_info_url = 'https://api.canva.com/rest/v1/users/me'
        user_info_response = requests.get(
            user_info_url, headers={'Authorization': f'Bearer {access_token}'})
        if user_info_response.status_code != 200:
            logger.error('Failed to fetch user info from Canva')
            return None
        return user_info_response.json()

    @staticmethod
    def validate_oauth_state(state: OAuthState) -> Optional[OAuthState]:

        try:
            oauth_state = OAuthState.objects.get(state=state)
        except OAuthState.DoesNotExist:
            logger.error(f'Invalid state parameter: {state}')
            return None

        if oauth_state.is_expired():
            oauth_state.delete()
            logger.error(f'State parameter expired: {state}')
            return None

        return oauth_state

    @staticmethod
    def get_user_profile(access_token: str) -> Optional[dict[str, any]]:
        user_profile_url = 'https://api.canva.com/rest/v1/users/me/profile'
        user_profile_response = requests.get(user_profile_url, headers={
                                             'Authorization': f'Bearer {access_token}'})
        if user_profile_response.status_code != 200:
            logger.error('Failed to fetch user profile from Canva')
            return None
        return user_profile_response.json()

    @staticmethod
    def create_or_update_user(user_info: dict[str, any], user_profile: dict[str, any], access_token: str, refresh_token: str, expires_in: int) -> User:

        team_user = user_info.get('team_user', {})
        user_id = team_user.get('user_id', '')
        team_id = team_user.get('team_id', '')

        display_name = user_profile.get('display_name', '')

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

        return user
