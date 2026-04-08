from datetime import datetime, timezone

def get_latest_alerts():
    now = datetime.now(timezone.utc).isoformat()
    return [
        {"severity": "high", "title": "AIS gap", "text": "PACIFIC STAR gap > 8h near chokepoint", "ts": now},
        {"severity": "medium", "title": "Route deviation", "text": "NORDIC WAVE deviated from baseline corridor", "ts": now},
        {"severity": "low", "title": "Loitering", "text": "ORBIT FISHER slow movement outside anchorage", "ts": now},
    ]
