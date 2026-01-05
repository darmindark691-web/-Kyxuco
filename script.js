const API_TOKEN = "70478676d7013734e885bf542264a2c0babd89a7";

/* MENU */
function toggleMenu(){
  document.getElementById("sideMenu").classList.toggle("open");
}
function closePapers(){
  document.getElementById("papersPanel").classList.remove("active");
}

/* OPEN EXTERNAL */
function openExternal(url){
  document.getElementById("papersPanel").classList.add("active");
  document.getElementById("papersList").innerHTML =
    `<iframe src="${url}" style="width:100%;height:100%;border:none;"></iframe>`;
}

/* ARXIV */
async function loadArxiv(cat){
  document.getElementById("papersPanel").classList.add("active");
  document.getElementById("papersList").innerHTML = "Loading papers…";

  const proxy = "https://api.allorigins.win/raw?url=";
  const url = `https://export.arxiv.org/api/query?search_query=cat:${cat}&max_results=20`;

  const res = await fetch(proxy + encodeURIComponent(url));
  const text = await res.text();
  const xml = new DOMParser().parseFromString(text,"text/xml");
  const entries = xml.getElementsByTagName("entry");

  let html = "";
  for(let e of entries){
    const title = e.getElementsByTagName("title")[0].textContent;
    const pdf = e.getElementsByTagName("link")[1].getAttribute("href");
    html += `<div class="paper-item">
      <a href="${pdf}" target="_blank">📄 ${title}</a>
    </div>`;
  }
  document.getElementById("papersList").innerHTML = html;
}

/* AQI */
const cities = [
  { name:"Delhi", query:"delhi" },
  { name:"Mumbai", query:"mumbai" },
  { name:"Beijing", query:"beijing" },
  { name:"Tokyo", query:"tokyo" },
  { name:"Washington DC", query:"washington" }
];

function getAQIStatus(a){
  if(a<=50) return "Excellent 🟢";
  if(a<=100) return "Good 🟡";
  if(a<=200) return "Moderate 🟠";
  if(a<=300) return "Poor 🔴";
  return "Very Poor ☠️";
}

async function loadAirQuality(){
  const c=document.querySelector(".info-grid");
  c.innerHTML="";
  for(let city of cities){
    const r=await fetch(`https://api.waqi.info/feed/${city.query}/?token=${API_TOKEN}`);
    const d=await r.json();
    if(d.status!=="ok") continue;
    c.innerHTML+=`
      <div class="info-card">
        <h3>🌫 ${city.name}</h3>
        <p>AQI: ${d.data.aqi}</p>
        <p>${getAQIStatus(d.data.aqi)}</p>
      </div>`;
  }
}
loadAirQuality();
