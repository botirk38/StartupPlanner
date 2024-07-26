from rest_framework.response import Response
from rest_framework import status
from .utils import upload_to_vercel_blob
from django.contrib.auth import login, logout

from django.contrib.auth import authenticate


class AuthService:
    @staticmethod
    def get_account_details(user, serializer_class):
        serializer = serializer_class(user)
        data = serializer.data
        data['is_first_time_login'] = user.is_first_time_login()
        return Response(data)

    @staticmethod
    def update_account_details(user, data, serializer_class):
        file = data.get('avatar')
        if file:
            try:
                blob_url = upload_to_vercel_blob(file)
                data['avatar'] = blob_url
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = serializer_class(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def register_user(serializer):
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'User registered successfully',
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def logout_user(request, user):
        logout(request, user)

        return Response({
            "message": "User logged out successfully"
        })

    @staticmethod
    def login_user(request, email, password):

        user = authenticate(request=request, email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)

        return Response({
            "message": "User logged in successfully",
        }, status=status.HTTP_200_OK)
