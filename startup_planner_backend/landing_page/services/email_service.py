import uuid
import logging
import resend
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def send_contact_email(name, email, message):
        if not all([name, email, message]):
            return Response({'error': 'Missing name, email, or message'}, status=status.HTTP_400_BAD_REQUEST)

        params: resend.Emails.SendParams = {
            "from": "onboarding@resend.dev",
            "to": ["delivered@resend.dev"],
            "subject": f"Contact Us message from {name}",
            "html": f"<strong>{message}</strong><br><br>From: {name} &lt;{email}&gt;",
            "headers": {
                "X-Entity-Ref-ID": str(uuid.uuid4())
            },
        }

        try:
            email_response = resend.Emails.send(params)
            logger.debug(f'Email sent successfully: {email_response}')
            return Response({'success': 'Email sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'Failed to send email: {e}')
            return Response({'error': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
