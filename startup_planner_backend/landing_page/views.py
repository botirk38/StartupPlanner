from rest_framework.permissions import AllowAny
from .services.email_service import EmailService

from rest_framework.views import APIView


class ContactUsAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        return EmailService.send_contact_us_email(request.data)
