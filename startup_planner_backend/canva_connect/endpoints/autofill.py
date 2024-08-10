from pydantic import BaseModel
from typing import Dict, Any, Optional
from ..exceptions import CanvaAPIError
from .base import BaseEndpoint
import logging
import time

logger = logging.getLogger(__name__)


class AutofillOperationError(CanvaAPIError):
    pass


class AutofillDataItem(BaseModel):
    type: str
    asset_id: Optional[str] = None
    text: Optional[str] = None


class AutofillData(BaseModel):
    brand_template_id: str
    title: str
    data: Dict[str, AutofillDataItem]


class AutofillEndpoint(BaseEndpoint):
    BASE_ENDPOINT = "autofills"

    def autofill_template(self, autofill_data: AutofillData, max_retries: int = 10, initial_delay: float = 1) -> Dict[str, Any]:
        """
        Autofill a template and wait for the job to complete.

        Args:
            autofill_data (AutofillData): The data for autofilling, including brand_template_id, title, and autofill data.
            max_retries (int, optional): Maximum number of retries. Defaults to 10.
            initial_delay (float, optional): Initial delay between retries in seconds. Defaults to 1.

        Returns:
            Dict[str, Any]: The completed autofill job data.

        Raises:
            AutofillOperationError: If the autofill operation fails or times out.
        """
        try:
            autofill_job = self._create_autofill_job(autofill_data)
            job_id = autofill_job['job']['id']

            for attempt in range(max_retries):
                if autofill_job['job']['status'] == 'success':
                    logger.info(
                        f"Autofill job completed successfully: {job_id}")
                    return autofill_job

                if autofill_job['job']['status'] == 'failed':
                    error_message = autofill_job['job'].get(
                        'error', {}).get('message', 'Unknown error')
                    raise AutofillOperationError(
                        f"Autofill job failed: {error_message}")

                # Exponential backoff
                delay = initial_delay * (2 ** attempt)
                logger.info(
                    f"Autofill job in progress. Retrying in {delay:.2f} seconds...")
                time.sleep(delay)

                autofill_job = self.get_autofill_job(job_id)

            raise AutofillOperationError(
                f"Autofill job timed out after {max_retries} attempts")

        except Exception as e:
            logger.error(f"Autofill operation failed: {e}")
            raise AutofillOperationError(
                f"Autofill operation failed: {str(e)}")

    def _create_autofill_job(self, autofill_data: AutofillData) -> Dict[str, Any]:
        """
        Create an autofill job.

        Args:
            autofill_data (AutofillData): The data for autofilling, including brand_template_id, title, and autofill data.

        Returns:
            Dict[str, Any]: The created autofill job data.

        Raises:
            AutofillOperationError: If the job creation fails.
        """
        try:
            payload = autofill_data.dict()
            response = self._make_request(
                "POST", endpoint=self.BASE_ENDPOINT, data=payload)
            return response
        except Exception as e:
            logger.error(f"Autofill job creation failed: {e}")
            raise AutofillOperationError(
                f"Autofill job creation failed: {str(e)}")

    def get_autofill_job(self, job_id: str) -> Dict[str, Any]:
        """
        Get the status of an autofill job.

        Args:
            job_id (str): The ID of the autofill job.

        Returns:
            Dict[str, Any]: The current status of the autofill job.

        Raises:
            AutofillOperationError: If fetching the job status fails.
        """
        try:
            endpoint = f"{self.BASE_ENDPOINT}/{job_id}"
            response = self._make_request("GET", endpoint=endpoint)
            return response
        except Exception as e:
            logger.error(f"Failed to get autofill job status: {e}")
            raise AutofillOperationError(
                f"Failed to get autofill job status: {str(e)}")

