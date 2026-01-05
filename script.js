// MENU
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
menuBtn.onclick = () => sideMenu.classList.toggle("open");

// AQI
const API_TOKEN = "PUT_YOUR_WAQI_TOKEN";
const cities = ["delhi","mumbai","kolkata","beijing","tokyo"];

const grid = document.getElementById("aqiGrid");
cities.forEach(async c => {
  const r = await fetch(`https://api.waqi.info/feed/${c}/?token=${API_TOKEN}`);
  const d = await r.json();
  if(d.status==="ok"){
    grid.innerHTML += `
      <div class="info-card">
        <h3>${c.toUpperCase()}</h3>
        <p>AQI: ${d.data.aqi}</p>
      </div>`;
  }
});

// CATEGORIES
const ARXIV = ["cs.AI","cs.LG","cs.CV","cs.CL","cs.CR","cs.RO","stat.ML","math.OC","physics.comp-ph","econ.EM","q-bio.GN","q-bio.NC","cs.SE","cs.NI","physics.data-an"];
const BIORXIV = ["genomics","bioinformatics","neuroscience","genetics","microbiology","cell biology","systems biology","evolutionary biology"];
const ZENODO = ["computer science","biology","chemistry","physics","engineering","data science","cyber security"];
const GITHUB = ["machine-learning","artificial-intelligence","computer-vision","bioinformatics","cybersecurity"];

fill("arxivMenu", ARXIV, "arxiv");
fill("biorxivMenu", BIORXIV, "biorxiv");
fill("zenodoMenu", ZENODO, "zenodo");
fill("githubMenu", GITHUB, "github");

function fill(id,list,type){
  const box = document.getElementById(id);
  list.forEach(i=>{
    const b=document.createElement("button");
    b.textContent=i;
    b.onclick=()=>openResearch(type,i);
    box.appendChild(b);
  });
}

// RESEARCH SCREEN
let page=0, currentType="", currentCat="";

function openResearch(type,cat){
  currentType=type; currentCat=cat; page=0;
  document.getElementById("homeScreen").innerHTML=`
    <h1 class="brand-title">BharatVerse</h1>
    <p class="brand-sub">Bharat Search Hub</p>
    <div id="results"></div>
    <button class="next-btn" onclick="next()">Next</button>
  `;
  load();
}

function next(){ page++; load(); }

async function load(){
  const box=document.getElementById("results");

  if(currentType==="arxiv"){
    const url=`https://export.arxiv.org/api/query?search_query=cat:${currentCat}&start=${page*10}&max_results=10`;
    const r=await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    const t=await r.text();
    box.innerHTML+=`<pre>${t}</pre>`;
  }

  if(currentType==="biorxiv"){
    const r=await fetch(`https://api.biorxiv.org/details/biorxiv/2024-01-01/2024-12-31`);
    const d=await r.json();
    d.collection.filter(p=>p.category?.includes(currentCat))
      .slice(page*10,page*10+10)
      .forEach(p=>{
        box.innerHTML+=`<div class="paper"><a target="_blank" href="https://www.biorxiv.org/content/${p.doi}.full.pdf">${p.title}</a></div>`;
      });
  }

  if(currentType==="zenodo"){
    const r=await fetch(`https://zenodo.org/api/records/?q=${currentCat}&size=10&page=${page+1}`);
    const d=await r.json();
    d.hits.hits.forEach(p=>{
      box.innerHTML+=`<div class="paper"><a target="_blank" href="${p.links.html}">${p.metadata.title}</a></div>`;
    });
  }

  if(currentType==="github"){
    const r=await fetch(`https://api.github.com/search/repositories?q=${currentCat}&per_page=10&page=${page+1}`);
    const d=await r.json();
    d.items.forEach(p=>{
      box.innerHTML+=`<div class="paper"><a target="_blank" href="${p.html_url}">${p.full_name}</a></div>`;
    });
  }
}
