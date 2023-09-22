// stores api key in a variable, and gets the elements from the html
const apiKey = '049c062be56f82a87f0aa7eb5203acff';
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');


// Event listener for the city search form
cityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        cityInput.value = '';
    }
});

// Function to fetch weather data from OpenWeather API
async function getWeatherData(city) {
    try {
        // get current weather data
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
        const currentData = await currentResponse.json();

        // get 5-day forecast data
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`);
        const forecastData = await forecastResponse.json();

        // Display current weather
        displayCurrentWeather(currentData);

        // Display 5-day forecast
        displayForecast(forecastData);

        // Add city to search history
        addToSearchHistory(city);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// this function will display the current weather and the listed conditions
function displayCurrentWeather(data) {
    const { name, main, wind, weather } = data;
    const temperature = main.temp;
    const weatherCondition = weather[0].main;
    const windSpeed = wind.speed;
    const humidity = main.humidity;
    
    // Get the current date
    const date = new Date();

    //adds html to the current weather div
    const currentWeatherHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${temperature}°F</p>
        <p>Date: ${date.toLocaleDateString()}</p>
        <p>Weather: ${weatherCondition}</p>
        <p>Wind Speed: ${windSpeed} mph</p>
        <p>Humidity: ${humidity}%</p>
    `;
    currentWeather.innerHTML = currentWeatherHTML;
}

// Function to display 5-day forecast
function displayForecast(data) {
    const forecastList = data.list;

    //for loop to display the 5 day forecast, and the listed conditions
    let forecastHTML = '<h2>5-Day Forecast</h2>';
    for (let i = 0; i < forecastList.length; i += 8) {
        const forecastData = forecastList[i];
        const date = new Date(forecastData.dt_txt);
        const temperature = forecastData.main.temp;
        const weatherCondition = forecastData.weather[0].main;
        const windSpeed = forecastData.wind.speed;
        const humidity = forecastData.main.humidity;

        //adds html to the forecast div
        forecastHTML += `
            <div class="forecast-item">
                <p>Date: ${date.toLocaleDateString()}</p>
                <p>Temperature: ${temperature}°F</p>
                <p>Weather: ${weatherCondition}</p>
                <p>Wind Speed: ${windSpeed} mph</p>
                <p>Humidity: ${humidity}%</p>
            </div>
        `;
    }

    forecast.innerHTML = forecastHTML;
}

// Function to add city to search history and local storage
function addToSearchHistory(city) {
    // Check if the city already exists in the search history
    const existingCities = Array.from(searchHistory.children).map((button) => button.textContent);
    if (!existingCities.includes(city)) {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', () => {
            getWeatherData(city);
        });
        searchHistory.appendChild(button);
        // Save the city to local storage
        saveCityToLocalStorage(city);
    }
}



