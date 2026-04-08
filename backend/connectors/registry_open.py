from typing import Any, Dict, List
from .base import VesselConnector

OPEN_VESSELS = [
    {"name":"PACIFIC STAR","imo":"9387421","mmsi":"538009812","flag":"MH","type":"Tanker","lat":1.265,"lon":103.820},
    {"name":"NORDIC WAVE","imo":"9291550","mmsi":"219456000","flag":"DK","type":"Bulk Carrier","lat":25.284,"lon":56.350},
    {"name":"BLUE HORIZON","imo":"9475012","mmsi":"477002311","flag":"HK","type":"Container","lat":35.902,"lon":14.510},
    {"name":"SEA LANTERN","imo":"9527748","mmsi":"636018765","flag":"LR","type":"Tanker","lat":29.944,"lon":32.550},
    {"name":"ORBIT FISHER","imo":"0000000","mmsi":"563778991","flag":"SG","type":"Fishing","lat":6.120,"lon":80.200},
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
