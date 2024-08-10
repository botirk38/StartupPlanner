from .base import BaseEndpoint
from ..exceptions import CanvaAPIError
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)


class BrandTemplateOperationError(CanvaAPIError):
    """Custom exception for brand template operations."""
    pass


class BrandTemplatesEndpoint(BaseEndpoint):
    """Endpoint for interacting with brand templates in the Canva API."""

    BASE_ENDPOINT = "brand-templates"

    def _construct_endpoint(self, *parts: str) -> str:
        """Construct the endpoint URL."""
        return "/".join([self.BASE_ENDPOINT] + list(parts))

    def _handle_request(self, method: str, endpoint: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Handle API requests and exceptions."""
        try:
            return self._make_request(method, endpoint, params=params)
        except Exception as e:
            logger.error(f"Error in brand template operation: {e}")
            raise BrandTemplateOperationError(
                f"Brand template operation failed: {e}")

    def get_brand_template(self, brand_template_id: str) -> Dict[str, Any]:
        """
        Get details of a specific brand template.

        :param brand_template_id: ID of the brand template
        :return: Details of the brand template
        :raises BrandTemplateOperationError: If the operation fails
        """
        endpoint = self._construct_endpoint(brand_template_id)
        return self._handle_request("GET", endpoint)

    def get_brand_template_dataset(self, brand_template_id: str) -> Dict[str, Any]:
        """
        Get the dataset of a specific brand template.

        :param brand_template_id: ID of the brand template
        :return: Dataset of the brand template
        :raises BrandTemplateOperationError: If the operation fails
        """
        endpoint = self._construct_endpoint(brand_template_id, "dataset")
        return self._handle_request("GET", endpoint)

    def list_brand_templates(self, limit: Optional[int] = None, continuation: Optional[str] = None, query: Optional[str] = None) -> Dict[str, Any]:
        """
        List all brand templates.

        :param limit: Maximum number of templates to return (optional)
        :param continuation: Continuation token for pagination (optional)
        :param query : The query by the user.
        :return: List of brand templates
        :raises BrandTemplateOperationError: If the operation fails
        """
        params = {}
        if limit is not None:
            params['limit'] = limit
        if continuation:
            params['continuation'] = continuation

        if query:
            params['query'] = query

        return self._handle_request("GET", self.BASE_ENDPOINT, params=params)

