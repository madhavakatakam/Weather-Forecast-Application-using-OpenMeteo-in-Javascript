let celsius = true;

function toggleUnits() {
    celsius = !celsius;
    document.getElementById("toggle").textContent = celsius ? "°F" : "°C";
}

function showError(sectionId, message) {
    const section = document.getElementById(sectionId);
    section.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg w-full text-center">
            ${message}
        </div>
    `;
}


async function getCoordinates(city) {
    const cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    try {
        const response = await fetch(cityURL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert("City not found. Please check the city name and try again.");
            return null;
        }

        const cityName = data.results[0].name;
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        const country = data.results[0].country;

        return { cityName, country, latitude, longitude };
    } catch (error) {
        showError("currentweather", "Unable to retrieve city details. Please check your internet connection and try again.");
    }
}

async function getWeather(currentValue = false) {
    let latitude, longitude, cityName, country;
    const weatherDescriptions = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️",
        2: "Partly cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫️",
        48: "Depositing rime fog 🌫️",
        51: "Light drizzle 🌦️",
        53: "Moderate drizzle 🌧️",
        55: "Dense drizzle 🌧️",
        56: "Light freezing drizzle ❄️🌧️",
        57: "Dense freezing drizzle ❄️🌧️",
        61: "Slight rain 🌦️",
        63: "Moderate rain 🌧️",
        65: "Heavy rain 🌧️🌧️",
        66: "Light freezing rain ❄️🌧️",
        67: "Heavy freezing rain ❄️🌧️",
        71: "Slight snow fall ❄️",
        73: "Moderate snow fall ❄️",
        75: "Heavy snow fall ❄️❄️",
        77: "Snow grains ❄️",
        80: "Slight rain showers 🌦️",
        81: "Moderate rain showers 🌧️",
        82: "Violent rain showers ⛈️🌧️",
        85: "Slight snow showers ❄️🌨️",
        86: "Heavy snow showers ❄️🌨️",
        95: "Thunderstorm ⛈️",
        96: "Thunderstorm with slight hail ⛈️🌩️",
        99: "Thunderstorm with heavy hail 🌩️🌪️"
    };



    if (currentValue) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            cityName = data.address.city || data.address.town || data.address.village || "Unknown city";
            country = data.address.country || "Unknown country";

        } catch (error) {
            showError("currentweather", "Cannot access your location. Please check your internet connection, enable location access in your browser or enter a city name manually.");
            return;
        }
    } else {
        const city = document.getElementById("cityInput").value.trim();

        if (!city) {
            alert("Please enter a valid city name before searching.");
            return;
        }

        const coordinates = await getCoordinates(city);
        if (!coordinates) return;

        ({ latitude, longitude, cityName, country } = coordinates);
    }

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min,windspeed_10m_max,weathercode&timezone=auto`;

    try {
        const response = await fetch(weatherURL);
        const data = await response.json();

        if (!data || !data.current_weather) {
            showError("currentweather", "Current Weather data is not available for this location. Please try a different city");
            showError("5-dayweather", "5-Day Forecast is not available for this location.");
            return;
        }

        const currentdiv = document.getElementById("currentweather");
        const nextdiv = document.getElementById("5-dayweather");
        currentdiv.innerHTML = "";
        nextdiv.innerHTML = "";

        const currentp1 = document.createElement("p");
        const currentp2 = document.createElement("p");

        currentp1.classList.add(
            "bg-amber-100",
            "border",
            "border-amber-300",
            "rounded-lg",
            "p-4",
            "text-teal-900",
            "shadow",
            "space-y-1",
            "transform",
            "hover:scale-105",
            "duration-300"
        );

        currentp2.classList.add(
            "bg-teal-50",
            "border",
            "border-teal-300",
            "rounded-lg",
            "p-4",
            "text-teal-900",
            "shadow-md",
            "space-y-1",
            "transform",
            "hover:scale-105",
            "duration-300"
        );

        const code = data.current_weather.weathercode;
        const desc = weatherDescriptions[code] || "Unknown";

        currentp1.innerHTML = `
  <h3 class="text-xl font-semibold text-sky-900 mb-2">Location Details</h3>
  <p><strong>Latitude:</strong> ${latitude}</p>
  <p><strong>Longitude:</strong> ${longitude}</p>
  <p><strong>City:</strong> ${cityName}</p>
  <p><strong>Country:</strong> ${country}</p>
`;

        let temperature = data.current_weather.temperature;
        const unit = celsius ? "°C" : "°F";
        temperature = celsius ? temperature : (temperature * 9) / 5 + 32;

        currentp2.innerHTML = `
  <h3 class="text-xl font-semibold text-sky-900 mb-2">Current Weather</h3>
  <p><strong>Temperature:</strong> ${temperature} ${unit}</p>
  <p><strong>Wind Speed:</strong> ${data.current_weather.windspeed} km/hr</p>
  <p><strong>Humidity:</strong> ${data.daily.relative_humidity_2m_min[0]}% - ${data.daily.relative_humidity_2m_max[0]}%</p>
  <p><strong>Condition:</strong> ${desc}</p>
`;

        currentdiv.appendChild(currentp1);
        currentdiv.appendChild(currentp2);

        if (data.current_weather.temperature > 40) {
            alert("Extreme Heat Alert! Avoid outdoor activities");
        }

        const days = Math.min(5, data.daily.time.length);
        const P = [];

        for (let i = 0; i < days; i++) {
            let code = data.daily.weathercode[i];
            let desc = weatherDescriptions[code] || "Unknown";

            const card = document.createElement("div");
            card.classList.add(
                "bg-cyan-50", "border", "border-cyan-300", "rounded-lg",
                "p-4", "text-emerald-900", "shadow",
                "hover:shadow-md", "transition", "transform",
                "hover:scale-105", "duration-300"
            );

            card.innerHTML = `
        <h3 class="text-lg font-semibold text-sky-900 mb-2 text-center">${data.daily.time[i]}</h3>
        <p><strong>Temp:</strong> ${data.daily.temperature_2m_min[i]}°C - ${data.daily.temperature_2m_max[i]}°C</p>
        <p><strong>Humidity:</strong> ${data.daily.relative_humidity_2m_min[i]}% - ${data.daily.relative_humidity_2m_max[i]}%</p>
        <p><strong>Wind:</strong> ${data.daily.windspeed_10m_max[i]} km/hr</p>
        <p><strong>Condition:</strong> ${desc}</p>
    `;
            console.log(data.daily.weathercode[i]);

            nextdiv.appendChild(card);
        }


        console.log("\n");
        return;
    } catch (error) {
        showError("currentweather", "Unable to load current weather data. Please check your internet connection and try again.");
        showError("5-dayweather", "Unable to load 5-day forecast data.");
    }
}
