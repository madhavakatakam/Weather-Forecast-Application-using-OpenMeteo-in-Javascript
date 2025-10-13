# Weather-Forecast-Application-using-OpenMeteo-in-Javascript
Weather Forecast Application provides real time current weather data and a 5-day weather forecast.
We use OpenMeteo which is a free and reliable API to fetch weather data. Currently can fetch latitude and longitude of city name entered in the input field. This data is crucial to fetch weather data. No CSS styling yet.
The webpage will perfectly fetch the city name, latitude and longitude of the city name entered in the input field. User will receive an alert if empty input field is submitted. Also added more features such as "search by current location" button, dropdown list for recent searches(all these are not fully functional yet).
The project now displays current weather data and 5-day weather forecast for the given city name in console. Handles all errors that might occur in the flow of the project.
Included Semantic HTML for better readability and SEO purposes.
We can now toggle units between Celsius and Fahrenheit for current temperature only. Will send an alert for cities with extreme heat (>40°C).
The toggle button now updates its inner text accordingly.
Added Geo-Location to fetch location data of user when search by location button is clicked(not fully functional yet). Flow of the project is updated with proper input validation and error handling.
The Geo-Location feature now works perfectly. When you click the “Use Current Location” button, it gets your latitude and longitude using the Geolocation API and finds your city and country from the OpenStreetMap API.
Currently, the webpage perfectly fetches current and 5-day weather data and displays it to the user on the webpage in plain text.
Added CSS Styling to Header section, current weather section and form elements of the webpage, added borders to help visualize and manage the layout of the webpage.
Included input.css and output.css files to build the Tailwind CSS for the webpage. The command to run the project is :
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
Removed all console statements. Now the weather data is displayed perfectly on the webpage and fixed the bug where paragraphs are stacked everytime the search button is clicked.
Added CSS styling and hover effects to form elements, and updated the layout and borders of the form section. Buttons now scale on hover.
Applied proper Tailwind CSS styling to the header and all three sections (form, current weather, and 5-day weather). Added scale on hover effects to relevant elements. The webpage is now partially responsive.
Updated the webpage styling and made it fully responsive on all screen sizes, including mobile devices. Fixed the extreme heat alert issue that appeared when toggling to Fahrenheit even for temperatures below 40 °C. Removed console error messages. Error messages now display directly on the UI.
Formatted HTML and JavaScript files for better readability. Added local storage functionality. Recently searched city names are now saved in the dropdown list and persist even after refreshing the webpage.
Added clear and descriptive comments to improve code readability.
