from rest_framework.response import Response
from rest_framework import status
from .utils import upload_to_vercel_blob
from rest_framework.serializers import Serializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserService:
    @classmethod
    def get_account_details(cls, user: User, serializer_class: Serializer):
        serializer = serializer_class(user)
        data = serializer.data
        data['is_first_time_login'] = user.is_first_time_login()
        return Response(data)

    @classmethod
    def update_account_details(cls, user: User, data: dict[str, any], serializer_class: Serializer):
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
