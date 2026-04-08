import feedparser
from typing import List, Dict, Any

RSS_FEEDS = [
    "https://www.hellenicshippingnews.com/feed/",
    "https://www.maritime-executive.com/rss",
    "https://splash247.com/feed/",
    "https://www.safety4sea.com/feed/",
]

def get_latest_news(limit: int = 30) -> List[Dict[str, Any]]:
    items = []
    for url in RSS_FEEDS:
        feed = feedparser.parse(url)
        for e in feed.entries[:20]:
            items.append({
                "source_feed": url,
                "title": e.get("title", ""),
                "link": e.get("link", ""),
                "published": e.get("published", ""),
                "published_parsed": e.get("published_parsed"),
                "summary": e.get("summary", "")[:300]
            })

    # Sort by parsed datetime (newest first)
    items = sorted(
        items,
        key=lambda x: x.get("published_parsed") or (0,),
        reverse=True
    )

    # remove helper field before return
    for i in items:
        i.pop("published_parsed", None)

    return items[:limit]