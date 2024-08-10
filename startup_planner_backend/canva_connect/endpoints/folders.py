from .base import BaseEndpoint
from typing import Optional, Dict, List, Any
from ..exceptions import CanvaAPIError
import logging

logger = logging.getLogger(__name__)


class FolderOperationError(CanvaAPIError):
    """Custom exception for folder operations."""
    pass


class FoldersEndpoint(BaseEndpoint):
    BASE_ENDPOINT = "folders"

    def _construct_endpoint(self, *parts: str) -> str:
        return "/".join([self.BASE_ENDPOINT] + list(parts))

    def create_folder(self, folder_name: str, parent_folder_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Create a new folder.

        :param folder_name: Name of the folder to create
        :param parent_folder_id: ID of the parent folder (optional)
        :return: Response data from the API
        :raises FolderOperationError: If folder creation fails
        """
        try:
            data = {"name": folder_name}
            if parent_folder_id:
                data["parent_folder_id"] = parent_folder_id
            return self._make_request("POST", self.BASE_ENDPOINT, data=data)
        except Exception as e:
            logger.error(f"Error creating folder: {e}")
            raise FolderOperationError(f"Error creating folder: {e}")

    def update_folder(self, folder_id: str, folder_name: str) -> Dict[str, Any]:
        """
        Update an existing folder.

        :param folder_id: ID of the folder to update
        :param folder_name: New name for the folder
        :return: Response data from the API
        :raises FolderOperationError: If folder update fails
        """
        try:
            data = {"name": folder_name}
            endpoint = self._construct_endpoint(folder_id)
            return self._make_request("PATCH", endpoint, data=data)
        except Exception as e:
            logger.error(f"Error updating folder: {e}")
            raise FolderOperationError(f"Error updating folder: {e}")

    def delete_folder(self, folder_id: str) -> Dict[str, Any]:
        """
        Delete a folder.

        :param folder_id: ID of the folder to delete
        :return: Response data from the API
        :raises FolderOperationError: If folder deletion fails
        """
        try:
            endpoint = self._construct_endpoint(folder_id)
            return self._make_request("DELETE", endpoint)
        except Exception as e:
            logger.error(f"Error deleting folder: {e}")
            raise FolderOperationError(f"Error deleting folder: {e}")

    def list_folder_items(self, folder_id: str, continuation: Optional[str] = None, item_types: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        List items in a folder.

        :param folder_id: ID of the folder to list items from
        :param continuation: Continuation token for pagination (optional)
        :param item_types: List of item types to filter by (optional)
        :return: Response data from the API
        :raises FolderOperationError: If listing folder items fails
        """
        try:
            endpoint = self._construct_endpoint(folder_id, "items")
            params: Dict[str, Any] = {}
            if continuation:
                params['continuation'] = continuation
            if item_types:
                params['item_types'] = ','.join(item_types)
            return self._make_request("GET", endpoint, params=params)
        except Exception as e:
            logger.error(f"Error listing folder items: {e}")
            raise FolderOperationError(f"Error listing folder items: {e}")

    def get_folder(self, folder_id: str) -> Dict[str, Any]:
        """
        Get information about a specific folder.

        :param folder_id: ID of the folder to retrieve
        :return: Response data from the API
        :raises FolderOperationError: If getting folder information fails
        """
        try:
            endpoint = self._construct_endpoint(folder_id)
            return self._make_request("GET", endpoint)
        except Exception as e:
            logger.error(f"Error getting folder: {e}")
            raise FolderOperationError(f"Error getting folder: {e}")

