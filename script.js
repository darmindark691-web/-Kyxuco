/***********************
  CONFIG — API KEYS
************************/

// 🔴 YAHAN APNI API KEYS PASTE KARO
const YOUTUBE_API_KEY = "AIzaSyDglEHDv_I9dsWKkktvADnBbL-b8ZK-z9Y";
const AQI_API_TOKEN   = "70478676d7013734e885bf542264a2c0babd89a7";

/***********************
  TAB SWITCH LOGIC
************************/
function switchTab(tabId) {
  document.querySelectorAll(".page, .container").forEach(el => {
    el.classList.remove("active");
  });

  document.querySelectorAll(".bottom-nav button").forEach(btn => {
    btn.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");

  const index = { home: 0, shorts: 1, news: 2 }[tabId];
  if (index !== undefined) {
    document.querySelectorAll(".bottom-nav button")[index].classList.add("active");
  }
}

/***********************
  AQI SECTION
************************/

const cities = [
  { name: "Delhi", country: "India", query: "delhi" },
  { name: "Mumbai", country: "India", query: "mumbai" },
  { name: "Amritsar", country: "India", query: "amritsar" },
  { name: "Patna", country: "India", query: "patna" },
  { name: "Kolkata", country: "India", query: "kolkata" },

  { name: "Beijing", country: "China", query: "beijing" },
  { name: "Washington DC", country: "USA", query: "washington" },
  { name: "Tokyo", country: "Japan", query: "tokyo" },
  { name: "Seoul", country: "South Korea", query: "seoul" },
  { name: "Islamabad", country: "Pakistan", query: "islamabad" }
];

function getAQIStatus(aqi) {
  if (aqi <= 50) return "Excellent 🟢";
  if (aqi <= 100) return "Good 🟡";
  if (aqi <= 200) return "Moderate 🟠";
  if (aqi <= 300) return "Poor 🔴";
  return "Very Poor ☠️";
}

async function loadAirQuality() {
  const container = document.querySelector(".info-grid");
  if (!container) return;

  container.innerHTML = "";

  for (const city of cities) {
    try {
      const res = await fetch(
        `https://api.waqi.info/feed/${city.query}/?token=${AQI_API_TOKEN}`
      );
      const data = await res.json();

      if (data.status !== "ok") continue;

      const aqi = data.data.aqi;
      const status = getAQIStatus(aqi);

      const card = document.createElement("div");
      card.className = "info-card";
      card.innerHTML = `
        <h3>🌫 ${city.name}, ${city.country}</h3>
        <p><strong>AQI:</strong> ${aqi}</p>
        <p>Status: <strong>${status}</strong></p>
      `;

      container.appendChild(card);
    } catch (e) {
      console.error("AQI error:", city.name);
    }
  }
}

/***********************
  YOUTUBE SHORTS SECTION
************************/

const shortsFeed = document.getElementById("shorts-feed");
const usedVideoIds = new Set();

async function loadYouTubeShorts() {
  if (!shortsFeed) return;

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=shorts&regionCode=IN&key=${YOUTUBE_API_KEY}`
    );

    const data = await res.json();
    shortsFeed.innerHTML = "";

    data.items.forEach(item => {
      const videoId = item.id.videoId;

      if (!videoId || usedVideoIds.has(videoId)) return;
      usedVideoIds.add(videoId);

      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.allow = "autoplay; encrypted-media";
      iframe.allowFullscreen = true;

      shortsFeed.appendChild(iframe);
    });

  } catch (err) {
    console.error("YouTube API error:", err);
  }
}

/***********************
  AUTO LOAD ON START
************************/

document.addEventListener("DOMContentLoaded", () => {
  loadAirQuality();
  loadYouTubeShorts();
});
