function getWeather() {
    city = document.getElementById("cityInput").value.trim();
    getCoordinates(city);
    console.log(city);
}

async function getCoordinates(city) {
    let coordinates = {};
    const cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    try {
        const response = await fetch(cityURL);
        const data = await response.json();
        console.log(data);
        const cityName = data.results[0].name;
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        coordinates = {cityName,latitude,longitude};
        console.log(coordinates);
        return coordinates;
    }

    catch(error) {
        console.log(error);
    }
}