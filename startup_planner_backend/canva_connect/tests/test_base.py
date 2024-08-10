# tests/test_endpoints/test_base.py

from django.test import TestCase
from unittest.mock import patch, MagicMock
from canva_connect.endpoints.base import BaseEndpoint
from canva_connect.exceptions import CanvaAPIError


class TestBaseEndpoint(TestCase):
    def setUp(self):
        self.mock_client = MagicMock()
        self.mock_client.base_url = "https://api.canva.com/v1/"
        self.mock_client.auth.get_headers.return_value = {
            "Authorization": "Bearer mock_token"}
        self.endpoint = BaseEndpoint(self.mock_client)

    @patch('canva_connect.endpoints.base.requests.request')
    def test_make_request_success(self, mock_request):
        mock_response = MagicMock()
        mock_response.json.return_value = {"key": "value"}
        mock_response.raise_for_status.return_value = None
        mock_request.return_value = mock_response

        result = self.endpoint._make_request("GET", "test-endpoint")

        self.assertEqual(result, {"key": "value"})
        mock_request.assert_called_once_with(
            "GET",
            "https://api.canva.com/v1/test-endpoint",
            headers={"Authorization": "Bearer mock_token"},
            json=None,
            params=None,
            data=None
        )
