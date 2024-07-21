from rest_framework.response import Response
from rest_framework import status


class SecurityService:
    @staticmethod
    def update_password(user, serializer):
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Security settings updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
