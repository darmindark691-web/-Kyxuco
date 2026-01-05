/******** MENU ********/
function toggleMenu(){
  document.getElementById("sideMenu").classList.toggle("open");
}

function closePapers(){
  document.getElementById("papersPanel").classList.remove("active");
}

/******** ARXIV PAPERS ********/
async function loadPapers(category){
  document.getElementById("papersPanel").classList.add("active");
  document.getElementById("sideMenu").classList.remove("open");

  const list = document.getElementById("papersList");
  list.innerHTML = "<p>Loading papers…</p>";

  const proxy = "https://api.allorigins.win/raw?url=";
  const arxivURL =
    `https://export.arxiv.org/api/query?search_query=cat:${category}&start=0&max_results=25`;

  try{
    const res = await fetch(proxy + encodeURIComponent(arxivURL));
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text,"text/xml");
    const entries = xml.getElementsByTagName("entry");

    list.innerHTML = "";

    for(let entry of entries){
      const title = entry.getElementsByTagName("title")[0].textContent.trim();
      const links = entry.getElementsByTagName("link");

      let pdf="";
      for(let l of links){
        if(l.getAttribute("type")==="application/pdf"){
          pdf=l.getAttribute("href");
        }
      }

      const div=document.createElement("div");
      div.className="paper-item";
      div.innerHTML=`<a href="${pdf}" target="_blank">📄 ${title}</a>`;
      list.appendChild(div);
    }
  }catch(e){
    list.innerHTML="<p>Error loading papers</p>";
  }
}
