from django.test import TestCase
from unittest.mock import patch, MagicMock
from canva_connect.endpoints.designs import DesignsEndpoint, DesignData, DesignType, DesignSummary, DesignListResponse, Ownership, SortBy, DesignsOperationError


class TestDesignsEndpoint(TestCase):
    def setUp(self):
        self.endpoint = DesignsEndpoint(MagicMock())  # Mock the client

    @patch('canva_connect.endpoints.base.BaseEndpoint._make_request')
    def test_create_design_success(self, mock_make_request):
        # Mock the API response
        mock_response = {
            "design": {
                "id": "DAFVztcvd9z",
                "title": "Test Design",
                "owner": {
                    "user_id": "auDAbliZ2rQNNOsUl5OLu",
                    "team_id": "Oi2RJILTrKk0KRhRUZozX"
                },
                "thumbnail": {
                    "width": 595,
                    "height": 335,
                    "url": "https://example.com/thumbnail.png"
                },
                "urls": {
                    "edit_url": "https://www.canva.com/design/edit",
                    "view_url": "https://www.canva.com/design/view"
                }
            }
        }
        mock_make_request.return_value = mock_response

        # Create test data
        design_data = DesignData(
            design_type=DesignType(type="presentation", name="Presentation"),
            asset_id="asset123",
            title="Test Design"
        )

        # Call the method
        result = self.endpoint.create_design(design_data)

        # Assert the result
        self.assertIsInstance(result, DesignSummary)
        self.assertEqual(result.id, "DAFVztcvd9z")
        self.assertEqual(result.title, "Test Design")

        # Assert that _make_request was called with correct arguments
        mock_make_request.assert_called_once_with(
            method="POST",
            endpoint=self.endpoint.BASE_ENDPOINT,
            data=design_data.dict()
        )

    @patch('canva_connect.endpoints.base.BaseEndpoint._make_request')
    def test_create_design_failure(self, mock_make_request):
        # Mock the API response for a failure case
        mock_make_request.side_effect = Exception("API Error")

        # Create test data
        design_data = DesignData(
            design_type=DesignType(type="presentation", name="Presentation"),
            asset_id="asset123",
            title="Test Design"
        )

        # Assert that the method raises an exception
        with self.assertRaises(DesignsOperationError):
            self.endpoint.create_design(design_data)

    @patch('canva_connect.endpoints.base.BaseEndpoint._make_request')
    def test_list_designs_success(self, mock_make_request):
        # Mock the API response
        mock_response = {
            "continuation": "next_page_token",
            "items": [
                {
                    "id": "DAFVztcvd9z",
                    "title": "My summer holiday",
                    "owner": {
                        "user_id": "auDAbliZ2rQNNOsUl5OLu",
                        "team_id": "Oi2RJILTrKk0KRhRUZozX"
                    },
                    "thumbnail": {
                        "width": 595,
                        "height": 335,
                        "url": "https://example.com/thumbnail.png"
                    },
                    "urls": {
                        "edit_url": "https://www.canva.com/design/edit",
                        "view_url": "https://www.canva.com/design/view"
                    }
                }
            ]
        }
        mock_make_request.return_value = mock_response

        # Call the method
        result = self.endpoint.list_designs(
            query="holiday", ownership=Ownership.owned, sort_by=SortBy.relevance)

        # Assert the result
        self.assertIsInstance(result, DesignListResponse)
        self.assertEqual(result.continuation, "next_page_token")
        self.assertEqual(len(result.items), 1)
        self.assertEqual(result.items[0].id, "DAFVztcvd9z")
        self.assertEqual(result.items[0].title, "My summer holiday")

        # Assert that _make_request was called with correct arguments
        mock_make_request.assert_called_once_with(
            method="GET",
            endpoint=self.endpoint.BASE_ENDPOINT,
            params={
                'query': 'holiday',
                'ownership': 'owned',
                'sort_by': 'relevance'
            }
        )

    @patch('canva_connect.endpoints.base.BaseEndpoint._make_request')
    def test_get_design_success(self, mock_make_request):
        design_id = "DAFVztcvd9z"
        # Mock the API response
        mock_response = {
            "design": {
                "id": design_id,
                "title": "My summer holiday",
                "owner": {
                    "user_id": "auDAbliZ2rQNNOsUl5OLu",
                    "team_id": "Oi2RJILTrKk0KRhRUZozX"
                },
                "thumbnail": {
                    "width": 595,
                    "height": 335,
                    "url": "https://example.com/thumbnail.png"
                },
                "urls": {
                    "edit_url": "https://www.canva.com/design/edit",
                    "view_url": "https://www.canva.com/design/view"
                }
            }
        }
        mock_make_request.return_value = mock_response

        # Call the method
        result = self.endpoint.get_design(design_id)

        # Assert the result
        self.assertIsInstance(result, DesignSummary)
        self.assertEqual(result.id, design_id)
        self.assertEqual(result.title, "My summer holiday")

        # Assert that _make_request was called with correct arguments
        mock_make_request.assert_called_once_with(
            method="GET",
            endpoint=f"{self.endpoint.BASE_ENDPOINT}/{design_id}"
        )

    @patch('canva_connect.endpoints.base.BaseEndpoint._make_request')
    def test_get_design_failure(self, mock_make_request):
        design_id = "nonexistent_id"
        # Mock the API response for a failure case
        mock_make_request.side_effect = Exception("API Error")

        # Assert that the method raises an exception
        with self.assertRaises(DesignsOperationError):
            self.endpoint.get_design(design_id)
