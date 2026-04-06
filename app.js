const API_BASE = "http://127.0.0.1:8000";

const map = L.map('map').setView([20, 30], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 12, attribution: '&copy; OpenStreetMap'
}).addTo(map);

const vesselList = document.getElementById('vesselList');
const alertsList = document.getElementById('alerts');
const search = document.getElementById('search');
const newsList = document.getElementById('newsList');

function badge(sev){ return `<span class="badge ${sev}">${sev.toUpperCase()}</span>`; }

function renderAlerts(){
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
    vesselList.innerHTML = "";
    (j.results || []).forEach(x => {
      const d = x.data || {};
      const li = document.createElement('li');
      li.innerHTML = `<strong>${d.name ?? "Unknown"}</strong><br><small>IMO ${d.imo ?? "-"} | MMSI ${d.mmsi ?? "-"} | ${d.type ?? "-"}</small>`;
      vesselList.appendChild(li);
    });
    if (!(j.results || []).length) vesselList.innerHTML = "<li>No results.</li>";
  } catch(e){
    vesselList.innerHTML = `<li>API error: ${e.message}</li>`;
  }
}

async function loadNews(){
  try{
    const r = await fetch(`${API_BASE}/api/news/latest?limit=10`);
    const j = await r.json();
    newsList.innerHTML = "";
    (j.items || []).forEach(n => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${n.link}" target="_blank" rel="noreferrer">${n.title}</a><br><small>${n.published}</small>`;
      newsList.appendChild(li);
    });
  } catch(e){
    newsList.innerHTML = `<li>News API error: ${e.message}</li>`;
  }
}

search.addEventListener('input', (e) => searchVessels(e.target.value.trim()));
renderAlerts();
loadNews();
setInterval(loadNews, 5 * 60 * 1000);
