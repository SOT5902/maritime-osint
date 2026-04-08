from services.alert_service import get_latest_alerts
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from services.vessel_service import unified_vessel_search
from services.news_service import get_latest_news

app = FastAPI(title="Maritime OSINT API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"ok": True}

@app.get("/api/vessel/search")
async def vessel_search(q: str = Query(..., min_length=2)):
    results = await unified_vessel_search(q)
    return {"query": q, "count": len(results), "results": results}

@app.get("/api/news/latest")
def news_latest(limit: int = 30):
    return {"count": limit, "items": get_latest_news(limit)}

@app.get("/api/alerts/latest")
def alerts_latest():
    items = get_latest_alerts()
    return {"count": len(items), "items": items}
