from typing import Any, Dict, List
from .base import VesselConnector

class GFWConnector(VesselConnector):
    name = "gfw"
    async def search_vessel(self, query: str) -> List[Dict[str, Any]]:
        return []
