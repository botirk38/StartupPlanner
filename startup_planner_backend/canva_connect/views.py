from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .canva_client import CanvaClient
from .endpoints.autofill import AutofillEndpoint, AutofillData, AutofillDataItem, AutofillOperationError
from .utils import get_valid_access_token


class AutofillTemplateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Get a valid access token for the user
            access_token = get_valid_access_token(request.user)

            # Extract necessary data from the request
            brand_template_id = request.data.get('brand_template_id')
            title = request.data.get('title')
            autofill_data = request.data.get('data', {})

            # Validate required fields
            if not all([brand_template_id, title, autofill_data]):
                return Response({'error': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

            # Create AutofillData object
            autofill_items = {
                key: AutofillDataItem(**value) for key, value in autofill_data.items()
            }
            autofill_data = AutofillData(
                brand_template_id=brand_template_id,
                title=title,
                data=autofill_items
            )

            # Initialize CanvaClient with the user's access token
            client = CanvaClient(access_token)

            # Create AutofillEndpoint instance
            autofill_endpoint = AutofillEndpoint(client)

            # Call autofill_template method
            result = autofill_endpoint.autofill_template(autofill_data)

            # Return the result
            return Response(result)

        except AutofillOperationError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': f'Unexpected error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
