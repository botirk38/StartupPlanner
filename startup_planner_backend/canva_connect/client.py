
from .auth import CanvaAuth
from .endpoints.assets import AssetsEndpoint
from .endpoints.folders import FoldersEndpoint


class CanvaClient:
    def __init__(self, access_token: str):
        self.auth = CanvaAuth(access_token)
        self.base_url = "https://api.canva.com/v1/"

        self.assets = AssetsEndpoint(self)
        self.folders = FoldersEndpoint(self)

    def get_headers(self):
        return self.auth.get_headers()
