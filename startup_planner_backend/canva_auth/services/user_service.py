from rest_framework.response import Response
from rest_framework import status
from .utils import upload_to_vercel_blob


class UserService:
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
