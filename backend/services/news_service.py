import feedparser
from typing import List, Dict, Any

RSS_FEEDS = [
    "https://www.hellenicshippingnews.com/feed/",
    "https://www.maritime-executive.com/rss",
    "https://www.safety4sea.com/feed/",
]

def get_latest_news(limit: int = 30) -> List[Dict[str, Any]]:
    items = []
    for url in RSS_FEEDS:
        feed = feedparser.parse(url)
        for e in feed.entries[:10]:
            items.append({
                "source_feed": url,
                "title": e.get("title",""),
                "link": e.get("link",""),
                "published": e.get("published",""),
                "summary": e.get("summary","")[:300]
            })
    items = sorted(items, key=lambda x: x.get("published",""), reverse=True)
    return items[:limit]
