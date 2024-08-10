import tempfile
from canva_connect.models import Asset, AssetUploadJob
from canva_connect.endpoints.assets import AssetsEndpoint
from django.test import TestCase
from unittest.mock import patch, MagicMock
from ..exceptions import CanvaAPIError
import base64


class TestAssetsEndpoint(TestCase):
    def setUp(self):
        self.mock_client = MagicMock()
        self.mock_client.base_url = "https://api.canva.com/v1/"
        self.endpoint = AssetsEndpoint(self.mock_client)

    @patch('canva_connect.endpoints.assets.time.sleep')
    def test_upload_asset_success(self, mock_sleep):
        with tempfile.NamedTemporaryFile() as temp_file:
            temp_file.write(b"test content")
            temp_file.flush()

            self.endpoint._create_asset_upload_job = MagicMock(
                return_value="job_id")
            self.endpoint._get_asset_upload_job = MagicMock(side_effect=[
                AssetUploadJob(id="job_id", status="in_progress"),
                AssetUploadJob(id="job_id", status="success", asset=Asset(
                    id="asset_id",
                    name="Test Asset",
                    tags=["test"],
                    created_at=1234567890,
                    updated_at=1234567890,
                    thumbnail={"url": "https://example.com/thumbnail.jpg"}
                ))
            ])

            result = self.endpoint.upload_asset(temp_file.name, "Test Asset")

            self.assertIsInstance(result, Asset)
            self.assertEqual(result.id, "asset_id")
            self.assertEqual(result.name, "Test Asset")

    def test_upload_asset_failure(self):
        with tempfile.NamedTemporaryFile() as temp_file:
            temp_file.write(b"test content")
            temp_file.flush()

            self.endpoint._create_asset_upload_job = MagicMock(
                return_value="job_id")
            self.endpoint._get_asset_upload_job = MagicMock(return_value=AssetUploadJob(
                id="job_id",
                status="failed",
                error={"code": "error_code", "message": "Error message"}
            ))

            with self.assertRaises(CanvaAPIError):
                self.endpoint.upload_asset(temp_file.name, "Test Asset")

    def test_create_asset_upload_job(self):
        with tempfile.NamedTemporaryFile() as temp_file:
            temp_file.write(b"test content")
            temp_file.flush()

            self.endpoint._make_request = MagicMock(
                return_value={"job": {"id": "job_id"}})

            result = self.endpoint._create_asset_upload_job(
                temp_file.name, "Test Asset")

            self.assertEqual(result, "job_id")
            self.endpoint._make_request.assert_called_once()

    def test_get_asset_upload_job(self):
        self.endpoint._make_request = MagicMock(return_value={"job": {
            "id": "job_id",
            "status": "success",
            "asset": {
                "id": "asset_id",
                "name": "Test Asset",
                "tags": ["test"],
                "created_at": 1234567890,
                "updated_at": 1234567890,
                "thumbnail": {"url": "https://example.com/thumbnail.jpg"}
            }
        }})

        result = self.endpoint._get_asset_upload_job("job_id")

        self.assertIsInstance(result, AssetUploadJob)
        self.assertEqual(result.id, "job_id")
        self.assertEqual(result.status, "success")
        self.assertIsInstance(result.asset, Asset)

    def test_create_asset_metadata(self):
        asset_name = "Test Asset"
        result = self.endpoint._create_asset_metadata(asset_name)

        # Check if the result is valid base64
        try:
            decoded = base64.b64decode(result).decode('utf-8')
            self.assertEqual(decoded, asset_name)
        except:
            self.fail("Result is not valid base64")

        # Check if the result matches the expected base64 string
        expected_base64 = "VGVzdCBBc3NldA=="  # "Test Asset" in base64
        self.assertEqual(result, expected_base64)
