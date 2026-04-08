const API_BASE = "https://maritime-osint-api.onrender.com";

let map = null;
const markers = new Map();

if (window.L && document.getElementById("map")) {
  map = L.map("map").setView([20, 30], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 12,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);
}

const vesselList = document.getElementById("vesselList");
const alertsList = document.getElementById("alerts");
const search = document.getElementById("search");
const newsList = document.getElementById("newsList");

function badge(sev) { return `<span class="badge ${sev}">${sev.toUpperCase()}</span>`; }

function async function loadAlerts() {
  try {
    const r = await fetch(`${API_BASE}/api/alerts/latest`);
    const j = await r.json();
    alertsList.innerHTML = "";

    (j.items || []).forEach((a) => {
      const li = document.createElement("li");
      li.innerHTML = `${badge(a.severity)} <strong>${a.title}</strong><br><small>${a.text}</small><br><small>${a.ts}</small>`;
      alertsList.appendChild(li);
    });

    if (!(j.items || []).length) {
      alertsList.innerHTML = "<li>No alerts.</li>";
    }
  } catch (e) {
    alertsList.innerHTML = `<li>Alerts API error: ${e.message}</li>`;
  }
}

function clearMarkers() {
  if (!map) return;
  markers.forEach((m) => map.removeLayer(m));
  markers.clear();
}

function renderVessels(results) {
  vesselList.innerHTML = "";
  clearMarkers();

  if (!results.length) {
    vesselList.innerHTML = "<li>No results.</li>";
    return;
  }

  for (const x of results) {
    const d = x.data || {};
    const li = document.createElement("li");
    li.innerHTML = `<strong>${d.name || "Unknown"}</strong><br><small>IMO ${d.imo || "-"} | MMSI ${d.mmsi || "-"} | ${d.type || "-"}</small>`;
    vesselList.appendChild(li);

    if (map && typeof d.lat === "number" && typeof d.lon === "number") {
      const key = d.mmsi || d.imo || d.name;
      const m = L.circleMarker([d.lat, d.lon], {
  radius: 8,
  color: "#7CFC98",
  weight: 2,
  fillColor: "#7CFC98",
  fillOpacity: 0.9
}).addTo(map).bindPopup(`${d.name || "Unknown"}<br>IMO ${d.imo || "-"}`);
      markers.set(key, m);

      li.onclick = () => map.setView([d.lat, d.lon], 6);
    }
  }
}

async function searchVessels(q) {
  if (!q || q.length < 2) {
    vesselList.innerHTML = "<li>Type at least 2 characters...</li>";
    clearMarkers();
    return;
  }
  try {
    const r = await fetch(`${API_BASE}/api/vessel/search?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    renderVessels(j.results || []);
  } catch (e) {
    vesselList.innerHTML = `<li>API error: ${e.message}</li>`;
  }
}

async function loadNews() {
  try {
    const r = await fetch(`${API_BASE}/api/news/latest?limit=10`);
    const j = await r.json();
    newsList.innerHTML = "";
    for (const n of (j.items || [])) {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${n.link}" target="_blank" rel="noreferrer">${n.title}</a><br><small>${n.published}</small>`;
      newsList.appendChild(li);
    }
  } catch (e) {
    newsList.innerHTML = `<li>News API error: ${e.message}</li>`;
  }
}

search.addEventListener("input", (e) => searchVessels(e.target.value.trim()));
loadAlerts();
loadNews();
setInterval(loadNews, 60000);
setInterval(loadAlerts, 60000);
