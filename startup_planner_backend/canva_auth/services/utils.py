import os
import base64
import hashlib
import logging
from vercel_blob import put

logger = logging.getLogger(__name__)


def generate_code_verifier() -> str:
    """
    Generates a secure random string for the code verifier.
    """
    return base64.urlsafe_b64encode(os.urandom(32)).decode('utf-8').rstrip('=')


def generate_code_challenge(code_verifier: str) -> str:
    """
    Generates a code challenge based on the code verifier.
    """
    code_challenge_digest = hashlib.sha256(
        code_verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(code_challenge_digest).decode('utf-8').rstrip('=')


def generate_state() -> str:
    """
    Generates a secure random string for the state parameter.
    """
    return base64.urlsafe_b64encode(os.urandom(16)).decode('utf-8').rstrip('=')


def upload_to_vercel_blob(file):
    response = put(file.name, file.read(), {'access': 'public'})
    return response['url']
