var weatherInfoEl = $('#weather-info');
var displayContainer = $('#display-column');
var forecastInfoContainer = $('#forecast-info-container');
var forecastCardContainer = $('#info-card-container');
var searchForm = $('#search-city');
var cityInput = $('#city-name');
var cityButtonEl = $('city-btn');

// get current info from local storage after weather search
var currentCityWeather = JSON.parse(localStorage.getItem('weather'));
// forEach call display
if (currentCityWeather) {
    currentCityWeather.forEach(function(weatherObject) {
        displayWeatherInfo(weatherObject.data);
    })
}

// get fiveday info from local storage after weather search
var dailyForecastWeather = JSON.parse(localStorage.getItem('fiveday'));
// forEach call display
if (dailyForecastWeather) {
    dailyForecastWeather.forEach(function(weatherObject) {
        displayWeatherInfo(weatherObject.data);
    })
}


// convert unix timestamp to a readable formatted date
function timeConverter(unixTimestamp) {
    var stamp = new Date(unixTimestamp * 1000);
    var month = stamp.getMonth();
    var date = stamp.getDate();
    var year = stamp.getFullYear();
    var time = date + '/' + month + '/' + year;
    return time;
}

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

            // save current weather to local storage
            var currentWeather = JSON.parse(localStorage.getItem('weather'));
            // if there is no weather stored then set to empty array
            if (!currentWeather)
                currentWeather = [];
    
            // if the weather for the searched city isnt already in storage loop through and grab
            var alreadySaved = false;
            console.log(currentWeather);
            currentWeather.forEach(function (city) {
                var name = city.name;
                if (name === cityWeather) {
                    alreadySaved = true;
                    // create and append button!
                    var cityBtn = $('<button class="btn btn-primary col-12 p-1 mt-3">').text(name);
                    cityButtonEl.append(cityBtn);
                }
            });

            if (!alreadySaved) {
                console.log(currentWeather);
                // if we didnt find a match above add to city array
                currentWeather.push({
                    name: cityWeather,
                    data: data
                });
            }

            // local storage set item
            localStorage.setItem('weather', JSON.stringify(currentWeather));

            // create header with city name
            var weatherHeaderEl = $('#weather-header');
            weatherHeaderEl.text('Current Weather: ' + data.name);
            weatherInfoEl.prepend(weatherHeaderEl);
            
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

    weatherInfoEl.css({"margin" : "15px", "border" : "solid 1px rgb(254, 171, 108)"});

    var currentIcon = $('#icon');
    var currentTempItem = $('#temp');
    var currentHumItem = $('#humidity');
    var currentWindItem = $('#wind');
    var currentUviItem = $('#uvi');

    // grab icon
    var icon =  $('<img class="p-1">').attr("src", "http://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + "@2x.png");
    currentIcon.append(icon);

    var currentTemp = Math.round(((weatherData.current.temp - 273.15) * 9/5 + 32) * 10) / 10;
    currentTempItem.text('Temp: ' + currentTemp + 'F');

    var currentHumidity = weatherData.current.humidity;
    currentHumItem.text('Humidity: ' + currentHumidity + '%');

    var currentWind = weatherData.current.wind_speed;
    currentWindItem.text('Wind: ' + currentWind + 'MPH');

    var currentUvi = weatherData.current.uvi;
    currentUviItem.text('UV Index: ' + currentUvi);
   
    var forecastHeaderEl = $('<h2 id="f-header">');
    forecastHeaderEl.text('5-Day Forecast:');
    forecastInfoContainer.prepend(forecastHeaderEl);

   for (i = 0; i < 5; i++) {

        var forecastData = weatherData.daily[i];

        // create forecast daily card
        var forecastCard = $('<div id="f-card" class="border-0">');
        // for each day create card title with date
        var forecastTimeStamp = forecastData.dt;
        var forecastDate = timeConverter(forecastTimeStamp);
        // var forecastDateFormat = moment(forecastDate.val("")).format('DD/MM/YYYY');
        var forecastTitle = $('<h3 class="m-3 text-light text-center">').text(forecastDate);
        // create card text with pulled info by appending li to ul
        var forecastText = $('<ul class="m-3 p-1 text-light">');

        // grab icon
        var forecastIcon =  $('<img class="p-1 text-center">').attr("src", "http://openweathermap.org/img/wn/" + forecastData.weather[0].icon + "@2x.png");
        forecastText.append(forecastIcon);

        // grab and create temp li
        var forecastTemp = Math.round(((forecastData.temp.day - 273.15) * 9/5 + 32) * 10) / 10;
        var forecastTempItem = $('<li class="p-1">').text('Temp: ' + forecastTemp + 'F');
        forecastText.append(forecastTempItem);

        // grab and create wind li
        var forecastWind = forecastData.wind_speed;
        var forecastWindItem = $('<li class="p-1">').text('Wind: ' + forecastWind + 'MPH');
        forecastText.append(forecastWindItem);

        // grab and create humidity li
        var forecastHum = forecastData.humidity;
        var forecastHumItem = $('<li class="p-1">').text('Humidity: ' + forecastHum + '%');
        forecastText.append(forecastHumItem);

        // append card divs to forecast container
        forecastCardContainer.append(forecastCard);
        forecastCard.append(forecastTitle);
        forecastCard.append(forecastText);
   }; 
}

// search form event listener
searchForm.submit(function(event) {
    event.preventDefault();

    var city = cityInput.val();
    if (city) {
        searchWeather(city);
    }

    cityInput.val("");
});

// city button event listener
cityButtonEl.submit(function(event) {
    event.preventDefault();

    var city = cityInput.val();
    if (city) {
        searchWeather(city);
    }

    cityInput.val("");
})
    
