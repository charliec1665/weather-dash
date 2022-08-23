var weatherInfoEl = $('#weather-info');
var forecastInfoEl = $('#forecast-info');
var searchForm = $('#search-city');
var cityInput = $('#city-name');

// get info from local storage
var currentCityWeather = JSON.parse(localStorage.getItem('weather'));
// forEach call display
currentCityWeather.forEach(function(weatherObject) {
    displayWeatherInfo(weatherObject.data);
})

var dailyForecastWeather = JSON.parse(localStorage.getItem('fiveday'));

dailyForecastWeather.forEach(function(weatherObject) {
    displayWeatherInfo(weatherObject.data);
})

// search form event listener
searchForm.submit(function(event) {
    event.preventDefault();

    var city = cityInput.val();
    if (city) {
        searchWeather(city);
    }

    cityInput.val("");
});

// function to fetch OpenWeather api info
function searchWeather(cityWeather) {
    // cityWeather = cityWeather.toLowercase();
    // fetch weather for current date according to city name entered in form
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityWeather + '&appid=84b79da5e5d7c92085660485702f4ce8')
        .then(function (result) {
            return result.json();
        })
        .then(function (data) {
            console.log(data);
            // grab lat and long from initial api info return
            var latitude = data.coord.lat;
            var longitude = data.coord.lon;
            console.log(latitude);
            console.log(longitude);

            // save current weather to local storage
            var currentWeather = JSON.parse(localStorage.getItem('weather'));
            // if (!currentWeather)
            //     currentWeather = [];
            
            // local storage set item, stringify for button
            localStorage.setItem('weather', JSON.stringify(currentWeather));

            var weatherHeaderEl = $('#weather-header');
            weatherHeaderEl.text('Current Weather: ' + data.name);
            weatherInfoEl.append(weatherHeaderEl);
            
            // fetch 5 day forecast
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&appid=84b79da5e5d7c92085660485702f4ce8')
            })
            .then(function (result) {
                console.log(result);
                return result.json();
            })
            .then(function (data) {
                console.log(data);
                // save 5 day forecast to local storage
                var fivedayForecast = JSON.parse(localStorage.getItem('fiveday'));
                // if (!fivedayForecast)
                //     fivedayForecast = [];
                
                // local storage set item, stringify for button
                localStorage.setItem('fiveday', JSON.stringify(fivedayForecast));
                // call display function
                displayWeatherInfo(data);
            })
        // catch
        .catch(function (error) {
            console.log('Oh no!')
            console.log(error);
            alert('weather not found');
        });
}



// function to display weather info
function displayWeatherInfo(weatherData) {
    var currentTempItem = $('#temp');
    var currentHumItem = $('#humidity');
    var currentWindItem = $('#wind');
    var currentUviItem = $('#uvi');

    var currentTemp = Math.round(((weatherData.current.temp - 273.15) * 9/5 + 32) * 10) / 10;
    currentTempItem.text('Temp: ' + currentTemp);

    var currentHumidity = weatherData.current.humidity;
    currentHumItem.text('Humidity: ' + currentHumidity);

    var currentWind = weatherData.current.wind_speed;
    currentWindItem.text('Wind: ' + currentWind);

    var currentUvi = weatherData.current.uvi;
    currentUviItem.text('UV Index: ' + currentUvi);
   
    var forecastHeaderEl = $('#f-header');
    forecastHeaderEl.text('5-Day Forecast');
    forecastInfoEl.append(forecastHeaderEl);

   for (i = 0; i < 5; i++) {
        // create forecast daily card
        
        var forecastTempItem = $('#temp');
        var forecastHumItem = $('#humidity');
        var forecastWindItem = $('#wind');

        var forecastData = weatherData.daily[i];

        var forecastTemp = Math.round(((forecastData.temp.day - 273.15) * 9/5 + 32) * 10) / 10;
        forecastTempItem.text('Temp: ' + forecastTemp);

        var forecastWind = forecastData.wind_speed;
        forecastWindItem.text('Wind: ' + forecastWind);

        var forecastHum = forecastData.humidity;
        forecastHumItem.text('Humidity: ' + forecastHum);
   }; 
}
    
