const API_BASE = "http://127.0.0.1:8000";

const map = L.map('map').setView([20, 30], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 12, attribution: '&copy; OpenStreetMap'
}).addTo(map);

const vesselList = document.getElementById('vesselList');
const alertsList = document.getElementById('alerts');
const search = document.getElementById('search');
const newsList = document.getElementById('newsList');
const markers = new Map();

function badge(sev){ return `<span class="badge ${sev}">${sev.toUpperCase()}</span>`; }

function renderVessels(items){
  vesselList.innerHTML = '';
  markers.forEach(m => map.removeLayer(m));
  markers.clear();

  items.forEach(v => {
    const d = v.data || v; // supports API shape and local shape
    if (!d) return;

    const li = document.createElement('li');
    li.innerHTML = `<strong>${d.name ?? "Unknown"}</strong><br><small>IMO ${d.imo ?? "-"} | MMSI ${d.mmsi ?? "-"} | ${d.type ?? "-"}</small>`;
    li.onclick = () => {
      if (d.lat && d.lon) map.setView([d.lat, d.lon], 6);
      markers.get(d.mmsi || d.imo || d.name)?.openPopup();
    };
    vesselList.appendChild(li);

    // optional marker only if coords exist
    if (d.lat && d.lon){
      const key = d.mmsi || d.imo || d.name;
      const m = L.marker([d.lat, d.lon]).addTo(map).bindPopup(
        `<b>${d.name ?? "Unknown"}</b><br>IMO: ${d.imo ?? "-"}<br>MMSI: ${d.mmsi ?? "-"}<br>Type: ${d.type ?? "-"}<br>Flag: ${d.flag ?? "-"}`
      );
      markers.set(key, m);
    }
  });

  if (!items.length) vesselList.innerHTML = "<li>No vessel matches found.</li>";
}

function renderAlertsStub(){
  const demo = [
    {severity:"high", text:"AIS gap > 8h near chokepoint."},
    {severity:"medium", text:"Route deviation from baseline corridor."},
    {severity:"low", text:"Loitering pattern outside anchorage."}
  ];
  alertsList.innerHTML = "";
  demo.forEach(a => {
    const li = document.createElement('li');
    li.innerHTML = `${badge(a.severity)} <small>${a.text}</small>`;
    alertsList.appendChild(li);
  });
}

async function searchVessels(q){
  if (!q || q.length < 2){
    vesselList.innerHTML = "<li>Type at least 2 characters…</li>";
    return;
  }
  try {
    const r = await fetch(`${API_BASE}/api/vessel/search?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    renderVessels(j.results || []);
  } catch (e){
    vesselList.innerHTML = `<li>API error: ${e.message}</li>`;
  }
}

async function loadNews(){
  if (!newsList) return;
  try {
    const r = await fetch(`${API_BASE}/api/news/latest?limit=15`);
    const j = await r.json();
    newsList.innerHTML = "";
    (j.items || []).forEach(n => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${n.link}" target="_blank" rel="noreferrer">${n.title}</a><br><small>${n.published}</small>`;
      newsList.appendChild(li);
    });
    if (!(j.items || []).length) newsList.innerHTML = "<li>No news items returned.</li>";
  } catch (e){
    newsList.innerHTML = `<li>News API error: ${e.message}</li>`;
  }
}

search.addEventListener('input', (e) => searchVessels(e.target.value.trim()));

renderAlertsStub();
loadNews();
setInterval(loadNews, 5 * 60 * 1000);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
