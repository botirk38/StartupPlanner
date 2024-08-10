import requests
from typing import Optional, Dict, Any
from ..exceptions import CanvaAPIError
import logging

logger = logging.getLogger(__name__)


class BaseEndpoint:
    def __init__(self, client):
        self.client = client

    def _make_request(self, method: str, endpoint: str, data: Any = None,
                      params: Optional[Dict[str, Any]] = None,
                      additional_headers: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        url = f"{self.client.base_url}{endpoint}"
        headers = self.client.auth.get_headers()

        if additional_headers:
            headers.update(additional_headers)

        try:
            response = requests.request(
                method, url, headers=headers, json=data, params=params, data=data)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"API request failed: {e}")
            raise CanvaAPIError(f"API request failed: {e}") from e
