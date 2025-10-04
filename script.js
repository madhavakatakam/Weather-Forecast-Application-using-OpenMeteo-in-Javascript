async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Empty field not accepted");
    return;
  }
  const coordinates = await getCoordinates(city);
  console.log(coordinates);
  console.log(coordinates.cityName);
  console.log(coordinates.latitude);
  console.log(coordinates.longitude);
}

async function getCoordinates(city) {
  let coordinates = {};
  const cityURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
  try {
    const response = await fetch(cityURL);
    const data = await response.json();
    console.log(data.results[0]);
    const cityName = data.results[0].name;
    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;
    coordinates = { cityName, latitude, longitude };
    return coordinates;
  }

  catch (error) {
    console.log(error);
  }
}
