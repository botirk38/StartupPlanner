from typing import Any, Dict

from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.serializers import Serializer

from .utils import upload_to_vercel_blob

User = get_user_model()


class AuthService:
    @classmethod
    def get_account_details(cls, user: User, serializer_class: Serializer) -> Response:
        serializer = serializer_class(user)
        data = serializer.data
        data['is_first_time_login'] = user.is_first_time_login()
        return Response(data)

    @classmethod
    def update_account_details(cls, user: User, data: Dict[str, Any], serializer_class: Serializer) -> Response:
        avatar_file = data.get('avatar')
        if avatar_file:
            try:
                blob_url = upload_to_vercel_blob(avatar_file)
                data['avatar'] = blob_url
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = serializer_class(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @classmethod
    def register_user(cls, request: Request, serializer: Serializer) -> Response:
        if serializer.is_valid():
            user = serializer.save()
            if user:
                login(request, user)
                return Response({
                    'message': 'User registered successfully',
                }, status=status.HTTP_201_CREATED)
            return Response({"error": "Could not create user."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @classmethod
    def logout_user(cls, request: Request) -> Response:
        logout(request)
        return Response({"message": "User logged out successfully"})

    @classmethod
    def login_user(cls, request: Request, email: str, password: str) -> Response:
        user = authenticate(request=request, email=email, password=password)
        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response({"message": "User logged in successfully"}, status=status.HTTP_200_OK)
