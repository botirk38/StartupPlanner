from rest_framework.response import Response
from rest_framework import status
from ..models import BillingInfo


class BillingService:
    @staticmethod
    def get_billing_info(user, serializer_class):
        billing_info, created = BillingInfo.objects.get_or_create(user=user)
        serializer = serializer_class(billing_info)
        return Response(serializer.data)

    @staticmethod
    def update_billing_info(user, data, serializer_class):
        billing_info, created = BillingInfo.objects.get_or_create(user=user)
        serializer = serializer_class(billing_info, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Billing information updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
