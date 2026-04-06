from typing import Any, Dict, List
from connectors.registry_open import OpenRegistryConnector
from connectors.gfw_stub import GFWConnector
from connectors.marinetraffic_stub import MarineTrafficConnector
from connectors.lloyds_stub import LloydsConnector

CONNECTORS = [
    OpenRegistryConnector(),
    GFWConnector(),
    MarineTrafficConnector(),
    LloydsConnector(),
]

async def unified_vessel_search(query: str) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    for connector in CONNECTORS:
        try:
            results.extend(await connector.search_vessel(query))
        except Exception as e:
            results.append({"source": connector.name, "error": str(e), "data": None})
    return results
