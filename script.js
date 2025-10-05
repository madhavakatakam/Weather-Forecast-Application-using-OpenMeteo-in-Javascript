let celsius = true;

function toggleUnits() {
    celsius = !celsius;
    alert(`Units Switched to ${celsius ? "celsius" : "fahrenheit"}`);
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

        console.log(data.results[0]);
        let cityName = data.results[0].name;
        let latitude = data.results[0].latitude;
        let longitude = data.results[0].longitude;
        let country = data.results[0].country;
        let coordinates = { cityName, country, latitude, longitude };
        return coordinates;
    }

    catch (error) {
        alert("Incorrect City Name!");
        console.log("Error fetching co-ordinates:", error);
    }
}

async function getWeather(currentValue = false) {

    let latitude;
    let longitude;
    let cityName;
    let country;

    if (currentValue) {
        try {
            console.log("Working");
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("Latitude: ", latitude);
            console.log("Longitude: ", longitude);
        }
        catch (error) {
            console.log("Error Fetching Current Location: ", error);
            return;
        }
    }

    else {
        const city = document.getElementById("cityInput").value.trim();
        if (!city) {
            alert("Empty field not accepted!");
            return;
        }

        const coordinates = await getCoordinates(city);
        if (!coordinates) return;
        else {

            latitude = coordinates.latitude;
            longitude = coordinates.longitude;
            cityName = coordinates.cityName;
            country = coordinates.country;
            console.log(coordinates);
            console.log(coordinates.cityName);
            console.log(coordinates.country);
            console.log(coordinates.latitude);
            console.log(coordinates.longitude);
        }
    }

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min,windspeed_10m_max,weathercode&timezone=auto`;

    try {
        const response = await fetch(weatherURL);
        const data = await response.json();

        if (!data.current_weather) {
            alert("Weather Data Not Available!");
            return;
        }

        console.log(data);
        console.log(`\nCurrent Weather Data for ${cityName}, ${country}:`);

        let temperature = data.current_weather.temperature;

        if (temperature > 40) {
            alert("Extreme Heat Alert!");
        }

        let unit = celsius ? "°C" : "°F";
        temperature = celsius ? temperature : (temperature * 9) / 5 + 32;
        console.log(`Current Temperature: ${temperature} ${unit}`);
        console.log(`Current Wind Speed: ${data.current_weather.windspeed} km/hr`);
        console.log(`Current Humidity is in the range: ${data.daily.relative_humidity_2m_min[0]} % - ${data.daily.relative_humidity_2m_max[0]} %`);
        console.log(`Current Weather Code: ${data.current_weather.weathercode}`);

        console.log(`\n5-day Weather Forecast:`);
        const days = Math.min(5, data.daily.time.length);
        for (let i = 0; i < days; i++) {
            console.log(`\nDate: ${data.daily.time[i]}`);
            console.log(`Temperature in range: ${data.daily.temperature_2m_min[i]} °C - ${data.daily.temperature_2m_max[i]} °C`)
            console.log(`Humidity: ${data.daily.relative_humidity_2m_min[i]} % - ${data.daily.relative_humidity_2m_max[i]} %`);
            console.log(`Windspeed Maximum: ${data.daily.windspeed_10m_max[i]} km/hr`);
            console.log(`Weather Code: ${data.daily.weathercode[i]}`);
        }

    }
    catch (error) {
        console.log("Error fetching weather:", error);
    }
}
