Weather Forecast Application using OpenMeteo API (JavaScript)

A responsive Weather Forecast Web App built with HTML, Tailwind CSS, and JavaScript. This project provides real-time weather data and a 5-day forecast using the Open-Meteo API. Users can get weather data by city name or use their current location. Previously searched cities are saved locally and persist even after refreshing the webpage.

Features:

Real-Time Weather Data:
Displays weather data that includes current temperature, humidity, wind speed, and weather conditions.
Shows both current and 5-day forecasts using the Open-Meteo API.

Search by City Name:
Fetches latitude and longitude from the Open-Meteo Geocoding API.
Displays city name, coordinates, and country along with weather data.

Use Current Location:
Uses the Geolocation API to detect your location automatically.
Reverse-geocodes your coordinates via the OpenStreetMap API to display city/country.

Celsius / Fahrenheit Toggle:
Easily switches temperature units between °C and °F.
Toggle button updates its label dynamically.

extreme Heat Alert:
Displays a JS alert message when current temperature exceeds 40 °C (Celsius only).

Persistent Recent Searches:
Recently searched cities are saved in localStorage.
A dropdown lets users quickly reselect saved cities (persists across sessions).

Robust Error Handling:
Handles invalid input, missing data, and network issues gracefully.
Displays friendly UI error messages instead of console logs.

Tools and Technologies used:
Component	  Technology
Frontend	: HTML5, Tailwind CSS, JavaScript (ES6)
APIs Used	: Open-Meteo API (Weather & Geocoding), OpenStreetMap (Reverse Geocoding)
Storage   :	Local Storage (for saving recent cities)

How It Works:

User Input:
Enter a city name or click “Use Current Location.”

Get Coordinates:
Fetch latitude and longitude from Open-Meteo Geocoding API or Geolocation API.

Fetch Weather:
Retrieve current and daily weather data from Open-Meteo Forecast API.

Display Results:
Current weather and 5-day forecast displayed in separate styled sections.

Save City:
City name stored in local storage for easy future access.

Setup Instructions:
1. Clone the Repository
git clone https://github.com/<your-username>/Weather-Forecast-Application-using-OpenMeteo-in-Javascript.git
cd Weather-Forecast-Application-using-OpenMeteo-in-Javascript

2. Install Tailwind CSS (CLI)

Make sure you have Node.js installed.
Run the Tailwind build command to generate your CSS output file:
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch

3. Run the Application

Simply open the index.html file in your browser.

**Project Structure:**
Weather-Forecast-Application-using-OpenMeteo-in-Javascript/
│
├── `index.html`          # Main webpage
├── `script.js`           # Core JavaScript logic
├── `src`
│   ├── `input.css`       # Tailwind input file
│   └── `output.css`      # Generated Tailwind output file
├── `README.md`           # Project documentation


Key JavaScript Functions:

Function	Description
getCoordinates(city)	           : Fetches latitude & longitude for the entered city.
getWeather(currentValue)	       : Fetches and displays current & 5-day weather data.
toggleUnits()	                   : Toggles between Celsius and Fahrenheit.
saveCityToLocalStorage(cityName) : Saves the searched city to local storage.
updateDropdown()	               : Updates the dropdown list with saved cities.
showError(sectionId, message)	   : Displays styled error messages in the UI.

APIs Used:

Open-Meteo Geocoding API:
Converts city names into geographic coordinates.
https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1

Open-Meteo Forecast API:
Retrieves weather data (current + 5-day).
https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min,windspeed_10m_max,weathercode&timezone=auto

OpenStreetMap Nominatim API:
Reverse geocodes coordinates into readable addresses.
https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json
