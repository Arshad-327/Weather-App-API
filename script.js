const API_KEY = "4c2823259faa1091b7fd12fbd995808d";

// =====================
// WEATHER ICON MAP
// =====================
const EMOJI_MAP = {
  "01d": "☀️",
  "01n": "🌙",

  "02d": "⛅",
  "02n": "🌥️",

  "03d": "☁️",
  "03n": "☁️",

  "04d": "☁️",
  "04n": "☁️",

  "09d": "🌧️",
  "09n": "🌧️",

  "10d": "🌦️",
  "10n": "🌧️",

  "11d": "⛈️",
  "11n": "⛈️",

  "13d": "❄️",
  "13n": "❄️",

  "50d": "🌫️",
  "50n": "🌫️"
};

// =====================
// STAR BACKGROUND
// =====================
function generateStars() {

  const container = document.getElementById("stars");

  for (let i = 0; i < 90; i++) {

    const star = document.createElement("div");

    star.className = "star";

    const size = Math.random() * 2.2 + 0.4;

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      --dur: ${(Math.random() * 3 + 2).toFixed(1)}s;
      animation-delay: ${(Math.random() * 4).toFixed(1)}s;
    `;

    container.appendChild(star);
  }
}

generateStars();

// =====================
// HELPER FUNCTIONS
// =====================

// Convert unix time to readable time
function formatTime(unix, timezoneOffset) {

  const date = new Date((unix + timezoneOffset) * 1000);

  const hours = date
    .getUTCHours()
    .toString()
    .padStart(2, "0");

  const mins = date
    .getUTCMinutes()
    .toString()
    .padStart(2, "0");

  return `${hours}:${mins}`;
}

// Current date
function getFormattedDate() {

  const now = new Date();

  const day = now.toLocaleDateString("en-US", {
    weekday: "long"
  });

  const date = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `${day}<br>${date} · ${time}`;
}

// Show error
function showError(msg) {

  document.getElementById("errorMsg").textContent = msg;

  document
    .getElementById("weatherCard")
    .classList.remove("show");

  document.getElementById("welcome").style.display = "block";
}

// Clear error
function clearError() {
  document.getElementById("errorMsg").textContent = "";
}

// =====================
// MAIN WEATHER FUNCTION
// =====================
async function getWeather() {

  const city = document
    .getElementById("cityInput")
    .value
    .trim();

  // Validate city
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  clearError();

  // Show loading
  document.getElementById("loading").style.display = "block";

  document
    .getElementById("weatherCard")
    .classList.remove("show");

  document.getElementById("welcome").style.display = "none";

  try {

    // API URL
    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    // Fetch data
    const response = await fetch(url);

    const data = await response.json();

    console.log(data);

    // Handle errors
    if (data.cod != 200) {

      showError(data.message || "Unable to fetch weather data.");

      document.getElementById("loading").style.display = "none";

      return;
    }

    // =====================
    // UPDATE WEATHER CARD
    // =====================

    // City name
    document.getElementById("cityName").textContent =
      data.name;

    // Country
    document.getElementById("countryName").textContent =
      data.sys.country;

    // Date
    document.getElementById("dateBlock").innerHTML =
      getFormattedDate();

    // Weather icon
    const iconCode = data.weather[0].icon;

    document.getElementById("weatherEmoji").textContent =
      EMOJI_MAP[iconCode] || "🌤️";

    // Temperature
    const temp = Math.round(data.main.temp);

    const tempMin = Math.round(data.main.temp_min);

    const tempMax = Math.round(data.main.temp_max);

    const feels = Math.round(data.main.feels_like);

    document.getElementById("tempNum").textContent =
      temp;

    document.getElementById("condition").textContent =
      data.weather[0].description;

    document.getElementById("feelsLike").textContent =
      `Feels like ${feels}°C`;

    document.getElementById("tempMin").textContent =
      `↓ ${tempMin}°`;

    document.getElementById("tempMax").textContent =
      `↑ ${tempMax}°`;

    // Temperature range bar
    const pct =
      tempMax > tempMin
        ? ((temp - tempMin) / (tempMax - tempMin)) * 100
        : 50;

    document.getElementById("rangeFill").style.width =
      `${Math.max(5, Math.min(95, pct))}%`;

    // Weather stats
    document.getElementById("humidity").textContent =
      data.main.humidity;

    document.getElementById("wind").textContent =
      Math.round(data.wind.speed * 3.6);

    document.getElementById("visibility").textContent =
      (data.visibility / 1000).toFixed(1);

    document.getElementById("pressure").textContent =
      data.main.pressure;

    // Sunrise & Sunset
    document.getElementById("sunrise").textContent =
      formatTime(data.sys.sunrise, data.timezone);

    document.getElementById("sunset").textContent =
      formatTime(data.sys.sunset, data.timezone);

    // Hide loading
    document.getElementById("loading").style.display =
      "none";

    // Show weather card
    document
      .getElementById("weatherCard")
      .classList.add("show");

  } catch (err) {

    console.error(err);

    showError(
      "Something went wrong. Check your internet connection."
    );

    document.getElementById("loading").style.display =
      "none";

    document.getElementById("welcome").style.display =
      "block";
  }
}

// =====================
// ENTER KEY SUPPORT
// =====================
document
  .getElementById("cityInput")
  .addEventListener("keypress", function (e) {

    if (e.key === "Enter") {
      getWeather();
    }

  });