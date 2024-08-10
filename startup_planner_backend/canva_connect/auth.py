from typing import Dict


class CanvaAuth:
    def __init__(self, access_token: str):
        self.access_token = access_token

    def get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
