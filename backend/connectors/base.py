from abc import ABC, abstractmethod
from typing import Any, Dict, List

class VesselConnector(ABC):
    name: str = "base"

    @abstractmethod
    async def search_vessel(self, query: str) -> List[Dict[str, Any]]:
        ...
