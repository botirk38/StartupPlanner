from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.serializers import Serializer

User = get_user_model()


class SecurityService:
    @staticmethod
    def update_password(user: User, serializer: Serializer):
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Security settings updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
