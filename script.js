/*********************************
 * YOUTUBE DATA API CONFIG
 *********************************/

// 🔑 YAHAN APNI API KEY PASTE KARO
const YT_API_KEY = "AIzaSyDglEHDv_I9dsWKkktvADnBbL-b8ZK-z9Y";

// Search config
const SEARCH_QUERY = "shorts";
const MAX_RESULTS = 10; // ek API call me (10 safe hai)
let nextPageToken = "";

// Storage
let shortIds = [];
let currentIndex = 0;

// DOM
const feed = document.getElementById("shortsFeed");

/*********************************
 * FETCH SHORTS FROM YOUTUBE API
 *********************************/
async function fetchShorts() {
  if (!YT_API_KEY) return;

  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet` +
    `&type=video` +
    `&videoDuration=short` +
    `&maxResults=${MAX_RESULTS}` +
    `&q=${encodeURIComponent(SEARCH_QUERY)}` +
    `&pageToken=${nextPageToken}` +
    `&key=${YT_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("YouTube API error:", data.error.message);
      return;
    }

    nextPageToken = data.nextPageToken || "";

    data.items.forEach(item => {
      if (item.id && item.id.videoId) {
        shortIds.push(item.id.videoId);
      }
    });

  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

/*********************************
 * LOAD SHORTS INTO UI (NO LIMIT)
 *********************************/
function renderShorts(batch = 4) {
  for (let i = 0; i < batch; i++) {
    if (currentIndex >= shortIds.length) return;

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${shortIds[currentIndex]}?rel=0`;
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";

    feed.appendChild(iframe);
    currentIndex++;
  }
}

/*********************************
 * INFINITE SCROLL (UNLIMITED FEEL)
 *********************************/
window.addEventListener("scroll", async () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 400
  ) {
    // Agar data kam pad rahi hai to nayi lao
    if (currentIndex + 4 >= shortIds.length && nextPageToken) {
      await fetchShorts(); // 🔥 new API call
    }

    renderShorts(4);
  }
});

/*********************************
 * INITIAL LOAD
 *********************************/
(async function init() {
  await fetchShorts(); // first API call
  renderShorts(6);     // first batch
})();
