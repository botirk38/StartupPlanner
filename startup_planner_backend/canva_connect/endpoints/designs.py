from ..exceptions import CanvaAPIError
from pydantic import BaseModel, HttpUrl
from .base import BaseEndpoint
from typing import Dict, Optional, List, Any
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class Ownership(str, Enum):
    owned = "owned"
    shared = "shared"
    any = "any"


class SortBy(str, Enum):
    relevance = "relevance"
    modified_ascending = "modified_ascending"
    modified_descending = "modified_descending"
    title_ascending = "title_ascending"
    title_descending = "title_descending"


class DesignsOperationError(CanvaAPIError):
    pass


class DesignType(BaseModel):
    type: str
    name: str


class DesignData(BaseModel):
    design_type: DesignType
    asset_id: str
    title: str


class Owner(BaseModel):
    user_id: str
    team_id: str


class Thumbnail(BaseModel):
    width: int
    height: int
    url: HttpUrl


class DesignUrls(BaseModel):
    edit_url: HttpUrl
    view_url: HttpUrl


class DesignSummary(BaseModel):
    id: str
    title: str
    owner: Owner
    thumbnail: Thumbnail
    urls: DesignUrls


class DesignListResponse(BaseModel):
    continuation: Optional[str]
    items: List[DesignSummary]


class DesignsEndpoint(BaseEndpoint):
    BASE_ENDPOINT = "designs"

    def create_design(self, data: DesignData) -> DesignSummary:
        """
        Create a new design.

        Args:
            data (DesignData): The data for creating the design.

        Returns:
            DesignSummary: A summary of the created design.

        Raises:
            DesignsOperationError: If the design creation fails.
        """
        try:
            response = self._make_request(
                method="POST",
                endpoint=self.BASE_ENDPOINT,
                data=data.dict()
            )
            return DesignSummary(**response['design'])
        except Exception as e:
            logger.error(f"Failed to create design: {e}")
            raise DesignsOperationError(f"Failed to create design: {str(e)}")

    def list_designs(
        self,
        query: Optional[str] = None,
        continuation: Optional[str] = None,
        ownership: Optional[Ownership] = None,
        sort_by: Optional[SortBy] = None
    ) -> DesignListResponse:
        """
        List designs based on the provided parameters.

        Args:
            query (Optional[str]): Search query for designs.
            continuation (Optional[str]): Continuation token for pagination.
            ownership (Optional[Ownership]): Filter designs by ownership.
            sort_by (Optional[SortBy]): Sort order for the designs.

        Returns:
            DesignListResponse: A response containing the list of designs and pagination info.

        Raises:
            DesignsOperationError: If listing designs fails.
        """
        try:
            params: Dict[str, Any] = {}
            if query:
                params['query'] = query
            if continuation:
                params['continuation'] = continuation
            if ownership:
                params['ownership'] = ownership.value
            if sort_by:
                params['sort_by'] = sort_by.value

            response = self._make_request(
                method="GET",
                endpoint=self.BASE_ENDPOINT,
                params=params
            )

            return DesignListResponse(**response)
        except Exception as e:
            logger.error(f"Failed to list designs: {e}")
            raise DesignsOperationError(f"Failed to list designs: {str(e)}")

    def get_design(self, design_id: str) -> DesignSummary:
        """
        Get details of a specific design.

        Args:
            design_id (str): The ID of the design to retrieve.

        Returns:
            DesignSummary: A summary of the requested design.

        Raises:
            DesignsOperationError: If retrieving the design fails.
        """
        try:
            response = self._make_request(
                method="GET",
                endpoint=f"{self.BASE_ENDPOINT}/{design_id}"
            )
            return DesignSummary(**response['design'])
        except Exception as e:
            logger.error(f"Failed to get design {design_id}: {e}")
            raise DesignsOperationError(
                f"Failed to get design {design_id}: {str(e)}")

