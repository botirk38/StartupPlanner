from django.conf import settings
from django.utils import timezone
import requests


def refresh_access_token(user):
    token_url = 'https://api.canva.com/rest/v1/oauth/token'
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': user.refresh_token,
        'client_id': settings.CANVA_CLIENT_ID,
        'client_secret': settings.CANVA_CLIENT_SECRET,
    }

    response = requests.post(token_url, data=data, headers={
                             'Content-Type': 'application/x-www-form-urlencoded'})

    if response.status_code != 200:
        raise Exception('Failed to refresh access token')

    tokens = response.json()
    user.set_tokens(tokens.get('access_token'), tokens.get(
        'refresh_token'), tokens.get('expires_in'))
    return user.access_token


def get_valid_access_token(user):
    if user.token_expiry and user.token_expiry > timezone.now():
        return user.access_token
    else:
        return refresh_access_token(user)
