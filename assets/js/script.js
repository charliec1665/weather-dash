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

            var weatherHeaderEl = $('<h2 class="card-title m-3 p-2 text-center">').text('Current Weather: ' + data.name);
            weatherInfoEl.append(weatherHeaderEl);

            // // call display function
            // displayWeatherInfo(data);
            
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
    // create current weather header and div using jquery
    var weatherStatEl = $('<div class="card-text m-3 p-2">').text("");

    weatherStatEl.append(weatherData.current.temp);
    weatherStatEl.append(weatherData.current.humidity);
    weatherStatEl.append(weatherData.current.wind_speed);
    weatherStatEl.append(weatherData.current.uvi);

    weatherInfoEl.append(weatherStatEl);

   for (i = 0; i < weatherData.length; i++) {
        // create forecast daily card and div using jquery
        var forecastHeaderEl = $('<h3 class="card-title m-3 p-2">').text(weatherData.daily.weatherData[i].dt);
        forecastInfoEl.append(forecastHeaderEl);
        var forecastStatEl = $('div class="card-text m-3 p-2">').text("");
        // go through forecast days and append to forecastStatEl
        forecastStatEl.append(weatherData.daily.weatherData[i].temp.day);
        forecastStatEl.append(weatherData.daily.weatherData[i].wind_speed);
        forecastStatEl.append(weatherData.daily.weatherData[i].humidity);
   }
    
    // append weather data to parent container
   forecastInfoEl.append(forecastStatEl);
}
    
