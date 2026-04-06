from typing import Any, Dict, List
from .base import VesselConnector

class LloydsConnector(VesselConnector):
    name = "lloyds_ihs"
    async def search_vessel(self, query: str) -> List[Dict[str, Any]]:
        return []
