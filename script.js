//Global celsius variable
let celsius = true;

//Toggle Units Function to Toggle Between Celsius and Fahrenheit
function toggleUnits() {
    celsius = !celsius;
    document.getElementById("toggle").textContent = celsius ? "°F" : "°C";
}

//Display Error Message Function
function showError(sectionId, message) {
    const section = document.getElementById(sectionId);
    section.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg w-full text-center">
            ⚠️ ${message}
        </div>
    `;
}

//Get Co-ordinates function fetches latitude and longitude using city name
async function getCoordinates(city) {
    const cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    try {
        const response = await fetch(cityURL);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert("City not found. Please check the city name and try again.");
            return null;
        }

        const { name: cityName, latitude, longitude, country } = data.results[0];
        return { cityName, country, latitude, longitude };
    } catch (error) {
        showError("currentweather", "Unable to retrieve city details. Please check your internet connection and try again.");
    }
}

//Local Storage function saves city name to Local Storage
function saveCityToLocalStorage(cityName) {
    if (!cityName) return;
    let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

    if (!savedCities.includes(cityName)) {
        savedCities.push(cityName);
        localStorage.setItem("savedCities", JSON.stringify(savedCities));
        updateDropdown();
    }
}

//Update Dropdown Function loads saved city names into dropdown list
function updateDropdown() {
    const select = document.getElementById("cityDropdown");
    const savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

    //clears existing cities
    select.innerHTML = "";

    // Hide dropdown if no saved cities
    if (savedCities.length === 0) {
        select.classList.add("hidden"); // hide dropdown
        return;
    }

    //Show dropdown if saved cities exist
    select.classList.remove("hidden");

    //Default Option
    const defaultOpt = document.createElement("option");
    defaultOpt.textContent = "Select a saved city";
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    select.appendChild(defaultOpt);

    //Add each saved City
    savedCities.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        select.appendChild(opt);
    });

    //Add listener
    select.onchange = async () => {
        const city = select.value;
        if (city && city !== "Select a saved city") {
            document.getElementById("cityInput").value = city;
            await getWeather(false);
        }
    };
}

//Clear Saved Cities Function - hides dropdown again
function clearSavedCities() {
    if (confirm("Are you sure you want to clear all saved cities?")) {
        localStorage.removeItem("savedCities");
        document.getElementById("cityDropdown").classList.add("hidden"); // hide again
        updateDropdown();
    }
}

//Get Weather function that fetches and displays current weather and 5-day weather forecast data
async function getWeather(currentValue = false) {
    let latitude, longitude, cityName, country;

    //Weather Descriptions corresponding to the weather codes
    const weatherDescriptions = {
        0: "Clear sky ☀️", 1: "Mainly clear 🌤️", 2: "Partly cloudy ⛅", 3: "Overcast ☁️",
        45: "Fog 🌫️", 48: "Depositing rime fog 🌫️", 51: "Light drizzle 🌦️", 53: "Moderate drizzle 🌧️",
        55: "Dense drizzle 🌧️", 56: "Light freezing drizzle ❄️🌧️", 57: "Dense freezing drizzle ❄️🌧️",
        61: "Slight rain 🌦️", 63: "Moderate rain 🌧️", 65: "Heavy rain 🌧️🌧️",
        66: "Light freezing rain ❄️🌧️", 67: "Heavy freezing rain ❄️🌧️",
        71: "Slight snow fall ❄️", 73: "Moderate snow fall ❄️", 75: "Heavy snow fall ❄️❄️",
        77: "Snow grains ❄️", 80: "Slight rain showers 🌦️", 81: "Moderate rain showers 🌧️",
        82: "Violent rain showers ⛈️🌧️", 85: "Slight snow showers ❄️🌨️", 86: "Heavy snow showers ❄️🌨️",
        95: "Thunderstorm ⛈️", 96: "Thunderstorm with slight hail ⛈️🌩️", 99: "Thunderstorm with heavy hail 🌩️🌪️"
    };

    //If using Search By Current Location
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
            showError("currentweather", "Cannot access your location. Please enable location access or enter a city name manually.");
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

    //Fetches Weather Data
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min,windspeed_10m_max,weathercode&timezone=auto`;

    try {
        const response = await fetch(weatherURL);
        const data = await response.json();

        if (!data || !data.current_weather) {
            showError("currentweather", "Current Weather data is not available for this location.");
            showError("5-dayweather", "5-Day Forecast is not available for this location.");
            return;
        }

        const currentdiv = document.getElementById("currentweather");
        const nextdiv = document.getElementById("5-dayweather");
        currentdiv.innerHTML = "";
        nextdiv.innerHTML = "";

        //Creating and Displaying Loaction Data on Location box
        const locationBox = document.createElement("p");
        locationBox.classList.add("bg-amber-100", "border", "border-amber-300", "rounded-lg", "p-4", "text-teal-900", "shadow", "transform", "hover:scale-105", "duration-300");
        locationBox.innerHTML = `
            <h3 class="text-xl font-semibold text-sky-900 mb-2">Location Details</h3>
            <p><strong>Latitude:</strong> ${latitude}</p>
            <p><strong>Longitude:</strong> ${longitude}</p>
            <p><strong>City:</strong> ${cityName}</p>
            <p><strong>Country:</strong> ${country}</p>
        `;

        //Creating and Displaying Current Weather Data on Weather box
        const weatherBox = document.createElement("p");
        weatherBox.classList.add("bg-teal-50", "border", "border-teal-300", "rounded-lg", "p-4", "text-teal-900", "shadow", "transform", "hover:scale-105", "duration-300");

        const code = data.current_weather.weathercode;
        const desc = weatherDescriptions[code] || "Unknown";

        let temperature = data.current_weather.temperature;
        const unit = celsius ? "°C" : "°F";
        temperature = celsius ? temperature : (temperature * 9) / 5 + 32;

        weatherBox.innerHTML = `
            <h3 class="text-xl font-semibold text-sky-900 mb-2">Current Weather</h3>
            <p><strong>Temperature:</strong> ${temperature} ${unit}</p>
            <p><strong>Wind Speed:</strong> ${data.current_weather.windspeed} km/hr</p>
            <p><strong>Humidity:</strong> ${data.daily.relative_humidity_2m_min[0]}% - ${data.daily.relative_humidity_2m_max[0]}%</p>
            <p><strong>Condition:</strong> ${desc}</p>
        `;

        currentdiv.appendChild(locationBox);
        currentdiv.appendChild(weatherBox);

        //Extreme Heat Alert
        if (data.current_weather.temperature > 40) {
            alert("Extreme Heat Alert! Avoid outdoor activities");
        }

        //5-Day Weather Forecast
        const days = Math.min(5, data.daily.time.length);
        for (let i = 0; i < days; i++) {
            const desc = weatherDescriptions[data.daily.weathercode[i]] || "Unknown";
            const card = document.createElement("div");
            card.classList.add("bg-cyan-50", "border", "border-cyan-300", "rounded-lg", "p-4", "text-emerald-900", "shadow", "hover:shadow-md", "transition", "transform", "hover:scale-105", "duration-300");
            card.innerHTML = `
                <h3 class="text-lg font-semibold text-sky-900 mb-2 text-center">${data.daily.time[i]}</h3>
                <p><strong>Temp:</strong> ${data.daily.temperature_2m_min[i]}°C - ${data.daily.temperature_2m_max[i]}°C</p>
                <p><strong>Humidity:</strong> ${data.daily.relative_humidity_2m_min[i]}% - ${data.daily.relative_humidity_2m_max[i]}%</p>
                <p><strong>Wind:</strong> ${data.daily.windspeed_10m_max[i]} km/hr</p>
                <p><strong>Condition:</strong> ${desc}</p>
            `;
            nextdiv.appendChild(card);
        }

        //Save Searched City
        if (!currentValue && cityName) saveCityToLocalStorage(cityName);
    } catch (error) {
        showError("currentweather", "Unable to load current weather data. Please check your internet connection.");
        showError("5-dayweather", "Unable to load 5-day forecast data.");
    }
}

//Loads Dropdown on Page Load
document.addEventListener("DOMContentLoaded", updateDropdown);
