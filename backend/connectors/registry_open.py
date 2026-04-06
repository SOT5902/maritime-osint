from typing import Any, Dict, List
from .base import VesselConnector

OPEN_VESSELS = [
    {"name":"PACIFIC STAR","imo":"9387421","mmsi":"538009812","flag":"MH","type":"Tanker"},
    {"name":"NORDIC WAVE","imo":"9291550","mmsi":"219456000","flag":"DK","type":"Bulk Carrier"},
]

class OpenRegistryConnector(VesselConnector):
    name = "open_registry"

    async def search_vessel(self, query: str) -> List[Dict[str, Any]]:
        q = query.lower().strip()
        out = []
        for v in OPEN_VESSELS:
            if q in v["name"].lower() or q in v["imo"] or q in v["mmsi"]:
                out.append({"source": self.name, "confidence": 0.75, "data": v})
        return out
