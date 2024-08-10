import unittest
from unittest.mock import Mock, patch
from canva_connect.endpoints.brand_templates import BrandTemplatesEndpoint, BrandTemplateOperationError


class TestBrandTemplatesEndpoint(unittest.TestCase):

    def setUp(self):
        self.mock_client = Mock()
        self.endpoint = BrandTemplatesEndpoint(self.mock_client)

    @patch.object(BrandTemplatesEndpoint, '_make_request')
    def test_get_brand_template(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {
            "id": "template1", "name": "Test Template"}

        # Act
        result = self.endpoint.get_brand_template("template1")

        # Assert
        mock_make_request.assert_called_once_with(
            "GET", "brand-templates/template1", params=None)
        self.assertEqual(result, {"id": "template1", "name": "Test Template"})

    @patch.object(BrandTemplatesEndpoint, '_make_request')
    def test_get_brand_template_dataset(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {"dataset": {"field1": "value1"}}

        # Act
        result = self.endpoint.get_brand_template_dataset("template1")

        # Assert
        mock_make_request.assert_called_once_with(
            "GET", "brand-templates/template1/dataset", params=None)
        self.assertEqual(result, {"dataset": {"field1": "value1"}})

    @patch.object(BrandTemplatesEndpoint, '_make_request')
    def test_list_brand_templates(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {"templates": [
            {"id": "template1"}, {"id": "template2"}]}

        # Act
        result = self.endpoint.list_brand_templates()

        # Assert
        mock_make_request.assert_called_once_with(
            "GET", "brand-templates", params={})
        self.assertEqual(
            result, {"templates": [{"id": "template1"}, {"id": "template2"}]})

    @patch.object(BrandTemplatesEndpoint, '_make_request')
    def test_list_brand_templates_with_params(self, mock_make_request):
        # Arrange
        mock_make_request.return_value = {"templates": [
            {"id": "template1"}], "continuation": "next_page"}

        # Act
        result = self.endpoint.list_brand_templates(
            limit=1, continuation="page1")

        # Assert
        mock_make_request.assert_called_once_with(
            "GET", "brand-templates", params={"limit": 1, "continuation": "page1"})
        self.assertEqual(
            result, {"templates": [{"id": "template1"}], "continuation": "next_page"})

    @patch.object(BrandTemplatesEndpoint, '_make_request')
    def test_brand_template_operation_error(self, mock_make_request):
        # Arrange
        mock_make_request.side_effect = Exception("API Error")

        # Act & Assert
        with self.assertRaises(BrandTemplateOperationError):
            self.endpoint.get_brand_template("template1")

    def test_construct_endpoint(self):
        # Act
        result = self.endpoint._construct_endpoint("template1", "dataset")

        # Assert
        self.assertEqual(result, "brand-templates/template1/dataset")


if __name__ == '__main__':
    unittest.main()
