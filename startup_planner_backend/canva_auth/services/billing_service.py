from rest_framework import status
from ..models import BillingInfo
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from django.contrib.auth import get_user_model

User = get_user_model()


class BillingService:
    @staticmethod
    def get_billing_info(user: User, serializer_class: Serializer) -> Response:
        billing_info, created = BillingInfo.objects.get_or_create(user=user)
        serializer = serializer_class(billing_info)
        return Response(serializer.data)

    @staticmethod
    def update_billing_info(user: User, data: dict[str, any], serializer_class: Serializer):
        billing_info, created = BillingInfo.objects.get_or_create(user=user)
        serializer = serializer_class(billing_info, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Billing information updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
