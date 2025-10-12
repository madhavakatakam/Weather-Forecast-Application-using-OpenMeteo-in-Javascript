let celsius = true;

function toggleUnits() {
    celsius = !celsius;
    document.getElementById("toggle").textContent = celsius ? "°F" : "°C";
}

async function getCoordinates(city) {
    const cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    try {
        const response = await fetch(cityURL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert("City not found!");
            return null;
        }

        const cityName = data.results[0].name;
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        const country = data.results[0].country;

        return { cityName, country, latitude, longitude };
    } catch (error) {
        alert("Incorrect City Name!");
        console.log("Error fetching coordinates:", error);
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
            console.log("Error fetching location data:", error);
            return;
        }
    } else {
        const city = document.getElementById("cityInput").value.trim();

        if (!city) {
            alert("Empty field not accepted!");
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

        if (!data.current_weather) {
            alert("Weather Data Not Available!");
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

        if (temperature > 40) {
            alert("Extreme Heat Alert!");
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
        console.log("Error fetching weather:", error);
    }
}
