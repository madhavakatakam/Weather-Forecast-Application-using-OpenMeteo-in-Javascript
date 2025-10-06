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

    if (currentValue) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);

            const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
            const response = await fetch(url);
            const data = await response.json();

            cityName = data.address.city || data.address.town || data.address.village || "Unknown city";
            country = data.address.country || "Unknown country";

            console.log(`City: ${cityName}`);
            console.log(`Country: ${country}`);
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

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log(`City: ${cityName}`);
        console.log(`Country: ${country}`);
    }

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min,windspeed_10m_max,weathercode&timezone=auto`;

    try {
        const response = await fetch(weatherURL);
        const data = await response.json();

        if (!data.current_weather) {
            alert("Weather Data Not Available!");
            return;
        }

        console.log(`\nCurrent Weather Data for ${cityName}, ${country}:`);

        let temperature = data.current_weather.temperature;
        if (temperature > 40) {
            alert("Extreme Heat Alert!");
        }

        const unit = celsius ? "°C" : "°F";
        temperature = celsius ? temperature : (temperature * 9) / 5 + 32;

        console.log(`Current Temperature: ${temperature} ${unit}`);
        console.log(`Current Wind Speed: ${data.current_weather.windspeed} km/hr`);
        console.log(`Current Humidity: ${data.daily.relative_humidity_2m_min[0]}% - ${data.daily.relative_humidity_2m_max[0]}%`);
        console.log(`Current Weather Code: ${data.current_weather.weathercode}`);

        console.log(`\n5-day Weather Forecast:`);
        const days = Math.min(5, data.daily.time.length);

        for (let i = 0; i < days; i++) {
            console.log(`\nDate: ${data.daily.time[i]}`);
            console.log(`Temperature: ${data.daily.temperature_2m_min[i]} °C - ${data.daily.temperature_2m_max[i]} °C`);
            console.log(`Humidity: ${data.daily.relative_humidity_2m_min[i]} % - ${data.daily.relative_humidity_2m_max[i]} %`);
            console.log(`Max Windspeed: ${data.daily.windspeed_10m_max[i]} km/hr`);
            console.log(`Weather Code: ${data.daily.weathercode[i]}`);
        }

        console.log("\n");
    } catch (error) {
        console.log("Error fetching weather:", error);
    }
}

