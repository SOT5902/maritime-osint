from typing import Any, Dict, List
from .base import VesselConnector

class MarineTrafficConnector(VesselConnector):
    name = "marinetraffic"
    async def search_vessel(self, query: str) -> List[Dict[str, Any]]:
        return []
