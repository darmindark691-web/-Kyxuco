/*********************************
 * 1️⃣ TAB SWITCHING
 *********************************/
function switchTab(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.bottom-nav button')
    .forEach(b => b.classList.remove('active'));

  event.currentTarget.classList.add('active');
}

/*********************************
 * 2️⃣ YOUTUBE DATA API CONFIG
 *********************************/
// 🔑 YAHAN APNI API KEY PASTE KARO
const YT_API_KEY = "AIzaSyDglEHDv_I9dsWKkktvADnBbL-b8ZK-z9Y";

// Search settings
const SEARCH_QUERY = "shorts";
const MAX_RESULTS = 10; // ek call me kitni videos
let nextPageToken = "";

// Shorts storage
let shortIds = [];
let index = 0;

// DOM
const feed = document.getElementById("shortsFeed");

/*********************************
 * 3️⃣ FETCH SHORTS FROM YOUTUBE API
 *********************************/
async function fetchShorts() {
  try {
    const url =
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet` +
      `&type=video` +
      `&videoDuration=short` +
      `&maxResults=${MAX_RESULTS}` +
      `&q=${encodeURIComponent(SEARCH_QUERY)}` +
      `&pageToken=${nextPageToken}` +
      `&key=${YT_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("YouTube API Error:", data.error.message);
      return;
    }

    nextPageToken = data.nextPageToken || "";

    data.items.forEach(item => {
      if (item.id && item.id.videoId) {
        shortIds.push(item.id.videoId);
      }
    });

  } catch (err) {
    console.error("Fetch shorts failed:", err);
  }
}

/*********************************
 * 4️⃣ LOAD SHORTS INTO UI (EMBED)
 *********************************/
function loadShorts(batch = 6) {
  for (let i = 0; i < batch; i++) {
    if (index >= shortIds.length) return;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${shortIds[index]}?rel=0`;
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";

    feed.appendChild(iframe);
    index++;
  }
}

/*********************************
 * 5️⃣ INFINITE SCROLL LOGIC
 *********************************/
window.addEventListener("scroll", async () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 300
  ) {
    // Agar IDs kam ho rahi hain to nayi lao
    if (index + 5 >= shortIds.length && nextPageToken) {
      await fetchShorts();
    }

    loadShorts(4);
  }
});

/*********************************
 * 6️⃣ INITIAL LOAD (FIRST TIME)
 *********************************/
(async function initShorts() {
  await fetchShorts(); // first API call
  loadShorts(6);       // first UI render
})();
