from .base import BaseEndpoint
from ..exceptions import CanvaAPIError
from ..models import Asset, AssetUploadJob, AssetUploadError
from typing import Optional
import time
import base64
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)


class AssetError(CanvaAPIError):
    """Exception raised for errors related to asset operations."""
    pass


class AssetsEndpoint(BaseEndpoint):
    """
    Endpoint for managing assets in the Canva API.

    This class provides methods for uploading assets and checking the status of asset upload jobs.
    """

    @contextmanager
    def _open_file(self, file_path: str):
        """
        Context manager for safely opening and closing files.

        Args:
            file_path (str): The path to the file to be opened.

        Yields:
            file: The opened file object.

        Raises:
            AssetError: If there's an error opening the file.
        """
        try:
            with open(file_path, 'rb') as file:
                yield file
        except IOError as e:
            logger.error(f"Error opening file {file_path}: {e}")
            raise AssetError(f"Failed to open file: {e}")

    def upload_asset(self, file_path: str, asset_name: str, max_retries: int = 10, initial_delay: float = 1) -> Asset:
        """
        Upload an asset to Canva.

        This method creates an asset upload job, monitors its progress, and returns the uploaded asset.

        Args:
            file_path (str): The path to the file to be uploaded.
            asset_name (str): The name to give the asset in Canva.
            max_retries (int, optional): Maximum number of retry attempts. Defaults to 10.
            initial_delay (float, optional): Initial delay between retries in seconds. Defaults to 1.

        Returns:
            Asset: The uploaded asset object.

        Raises:
            AssetError: If the upload fails or times out.
        """
        try:
            job_id = self._create_asset_upload_job(file_path, asset_name)
            logger.info(f"Asset upload job created with ID: {job_id}")

            for attempt in range(max_retries):
                job_status = self._get_asset_upload_job(job_id)

                if job_status.status == 'success':
                    logger.info(f"Asset upload successful: {job_status.asset}")
                    return job_status.asset
                elif job_status.status == 'failed':
                    error_msg = job_status.error.message if job_status.error else 'Unknown error'
                    raise AssetError(f"Asset upload failed: {error_msg}")
                elif job_status.status == 'in_progress':
                    delay = initial_delay * (2 ** attempt)
                    logger.info(
                        f"Job in progress. Retrying in {delay:.2f} seconds...")
                    time.sleep(delay)
                else:
                    raise AssetError(
                        f"Unknown job status: {job_status.status}")

            raise AssetError(
                f"Asset upload timed out after {max_retries} attempts")
        except Exception as e:
            logger.error(f"Error during asset upload: {e}")
            raise AssetError(f"Asset upload failed: {str(e)}") from e

    def _create_asset_upload_job(self, file_path: str, asset_name: str) -> str:
        """
        Create an asset upload job.

        Args:
            file_path (str): The path to the file to be uploaded.
            asset_name (str): The name to give the asset in Canva.

        Returns:
            str: The ID of the created asset upload job.

        Raises:
            AssetError: If there's an error creating the asset upload job.
        """
        endpoint = "asset-uploads"
        headers = {
            "Content-Type": "application/octet-stream",
            "Asset-Upload-Metadata": self._create_asset_metadata(asset_name)
        }

        try:
            with self._open_file(file_path) as file:
                response = self._make_request(
                    "POST", endpoint, data=file, additional_headers=headers)
            return response['job']['id']
        except Exception as e:
            logger.error(f"Error creating asset upload job: {e}")
            raise AssetError(
                f"Failed to create asset upload job: {str(e)}") from e

    def _get_asset_upload_job(self, job_id: str) -> AssetUploadJob:
        """
        Get the status of an asset upload job.

        Args:
            job_id (str): The ID of the asset upload job.

        Returns:
            AssetUploadJob: An object representing the current status of the job.

        Raises:
            AssetError: If there's an error getting the job status.
        """
        endpoint = f"asset-uploads/{job_id}"
        try:
            response = self._make_request("GET", endpoint)
            job_data = response['job']

            asset: Optional[Asset] = None
            if 'asset' in job_data:
                asset = Asset(**job_data['asset'])

            error: Optional[AssetUploadError] = None
            if 'error' in job_data:
                error = AssetUploadError(**job_data['error'])

            return AssetUploadJob(
                id=job_data['id'],
                status=job_data['status'],
                asset=asset,
                error=error
            )
        except Exception as e:
            logger.error(f"Error getting asset upload job status: {e}")
            raise AssetError(
                f"Failed to get asset upload job status: {str(e)}") from e

    @staticmethod
    def _create_asset_metadata(asset_name: str) -> str:
        """
        Create base64 encoded metadata for an asset.

        Args:
            asset_name (str): The name of the asset.

        Returns:
            str: Base64 encoded metadata string.

        Raises:
            AssetError: If there's an error creating the metadata.
        """
        try:
            return base64.b64encode(asset_name.encode()).decode()
        except Exception as e:
            logger.error(f"Error creating asset metadata: {e}")
            raise AssetError(
                f"Failed to create asset metadata: {str(e)}") from e

