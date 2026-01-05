const API_TOKEN = "70478676d7013734e885bf542264a2c0babd89a7";

/* Cities to monitor */
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
  { name: "Islamabad", country: "Pakistan", query: "islamabad" },

  { name: "London", country: "UK", query: "london" },
  { name: "Paris", country: "France", query: "paris" },
  { name: "Berlin", country: "Germany", query: "berlin" },
  { name: "Rome", country: "Italy", query: "rome" },
  { name: "Madrid", country: "Spain", query: "madrid" },
  { name: "Moscow", country: "Russia", query: "moscow" },
  { name: "Cairo", country: "Egypt", query: "cairo" },
  { name: "Bangkok", country: "Thailand", query: "bangkok" },
  { name: "Sydney", country: "Australia", query: "sydney" },
  { name: "Toronto", country: "Canada", query: "toronto" }
];

/* AQI category logic */
function getAQIStatus(aqi) {
  if (aqi <= 50) return "Excellent 🟢";
  if (aqi <= 100) return "Good 🟡";
  if (aqi <= 200) return "Moderate 🟠";
  if (aqi <= 300) return "Poor 🔴";
  return "Very Poor ☠️";
}

/* Fetch AQI */
async function loadAirQuality() {
  const container = document.querySelector(".info-grid");
  container.innerHTML = "";

  for (let city of cities) {
    try {
      const res = await fetch(
        `https://api.waqi.info/feed/${city.query}/?token=${API_TOKEN}`
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
    } catch (err) {
      console.error("AQI error:", city.name);
    }
  }
}

/* Load on page start */
loadAirQuality();
