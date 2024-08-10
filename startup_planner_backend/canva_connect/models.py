from dataclasses import dataclass
from typing import Optional, List, Dict, Any


@dataclass
class Asset:
    id: str
    name: str
    tags: List[str]
    created_at: int
    updated_at: int
    thumbnail: Dict[str, Any]


@dataclass
class AssetUploadError:
    code: str
    message: str


@dataclass
class AssetUploadJob:
    id: str
    status: str
    asset: Optional[Asset] = None
    error: Optional[AssetUploadError] = None
