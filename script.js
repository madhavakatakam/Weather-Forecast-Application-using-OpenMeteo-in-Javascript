    async function getCoordinates(city) {
        const cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
        try {
            const response = await fetch(cityURL);
            const data = await response.json();



            console.log(data.results[0]);
            const cityName = data.results[0].name;
            const latitude = data.results[0].latitude;
            const longitude = data.results[0].longitude;
            const country = data.results[0].country;
            const coordinates = { cityName, country, latitude, longitude };
            return coordinates;
        }

        catch (error) {
            alert("Incorrect City Name");
            console.log("Error fetching co-ordinates:", error);
        }
    }

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        alert("Empty field not accepted");
        return;
    }

    const coordinates = await getCoordinates(city);
    console.log(coordinates);
    console.log(coordinates.cityName);
    console.log(coordinates.country);
    console.log(coordinates.latitude);
    console.log(coordinates.longitude);

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min,windspeed_10m_max,weathercode&timezone=auto`;

    try {
        const response = await fetch(weatherURL);
        const data = await response.json();
        console.log(data);
        console.log(`\nCurrent Weather Data:`);
        console.log(`Current Temperature: ${data.current_weather.temperature}, °C`);
        console.log(`Current Wind Speed: ${data.current_weather.windspeed}, km/h1`);
        console.log(`Current Weather Code: ${data.current_weather.weathercode}`);
        console.log(`Current Humidity is in the range: ${data.daily.relative_humidity_2m_min[0]}%-${data.daily.relative_humidity_2m_max[0]}%`);

        console.log(`\n5-day Weather Forecast:`);
        for(let i=0;i<5;i++){
            console.log(`\nDate: ${data.daily.time[i]}`);
            console.log(`Temperature in range: ${data.daily.temperature_2m_min[i]}°C-${data.daily.temperature_2m_max[i]}°C`)
            console.log(`Humidity: ${data.daily.relative_humidity_2m_min[i]}km/hr-${data.daily.relative_humidity_2m_max[i]}km/hr`);
            console.log(`Windspeed Maximum: ${data.daily.windspeed_10m_max[i]}km/hr`);
            console.log(`Weather Code: ${data.daily.weathercode[i]}`);
        }

    }
    catch (error) {
        console.log("Error fetching weather:", error);
    }
}
