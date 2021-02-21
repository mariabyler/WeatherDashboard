var cityName;
var mainDate = moment().format('L');
var cityArray = [];

// html for city info

$(document).ready(function () {
    initializeLocalStorage();

    function buildQueryURL(cityName) {
        var startURL = "https://api.openweathermap.org/data/2.5/weather?q=";
        var apiKey = "&appid=c86c87e5937343a2b3c7326be88ccf19";
        var cityString = cityArray.join("")
        if (cityString.toLowerCase().includes(cityName.toLowerCase()) === false) {
            if (cityArray.length < 8) {
                cityArray.push(cityName);
            } else {
                cityArray.shift();
                cityArray.push(cityName);
            }
        }


        $('.list-group').empty();
        for (var i = 0; i < cityArray.length; i++) {
            var btn = $('<button>')
                .addClass("list-group-item list-group-item-action city")
                .text(cityArray[i]);
            $('.list-group').prepend(btn);
        }
        return queryURL = startURL + cityName + apiKey;
    }


    function updatePage(cityName) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var iconCode = response.weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
            var currentIcon = $('<img>').attr("src", iconUrl);
            currentIcon.attr("style", "height: 60px; width: 60px");
            var cityNameEl = $("<h2>").text(response.name);
            var displayMainDate = cityNameEl.append(" (" + mainDate + ")");
            var tempF = (response.main.temp - 273.15) * 1.8 + 32;
            var tempEL = $("<p>").text("Temperature: " + tempF.toFixed(0) + " °F");
            var humidEl = $("<p>").text("Humidity: " + response.main.humidity + "%");
            var windEl = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
            $('.city-results').append(displayMainDate, currentIcon, tempEL, humidEl, windEl);

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=c86c87e5937343a2b3c7326be88ccf19&lat=" + lat + "&lon=" + lon;

            $.ajax({
                url: queryURLUV,
                method: 'GET'
            }).then(function (response2) {
                var uvlresultsEl = $("<p>").html("UV Index: " + "<span class='temp'>" + response2.value + "</span>");
                tempVal = response2.value;
                $('.city-results').append(uvlresultsEl);
                if (tempVal < 4){
                    $('.temp').css('background-color', 'rgb(73, 203, 114)');
                } else if (tempVal > 4 && tempVal < 8){
                    $('.temp').css('background-color', 'rgb(247, 237, 105)');
                } else if (tempVal > 8){
                    $('.temp').css('background-color', 'rgb(247, 91, 88)');
                }
            });
        }).catch(function (error){
           
            
            alert('Invalid City');
            location.reload();
        });
        var forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=c86c87e5937343a2b3c7326be88ccf19";
        $.ajax({
            url: forcastURL,
            method: "GET"
        }).then(function (response3) {
            var results = response3.list; 
            $(".fiveday").empty();
            for (var i = 0; i < results.length; i += 8) {

                var forecastDiv = $("<div class='card shadow-sm text-white bg-info mx-auto mb-5 p-2' style='width: 9.4em; height: 12em;'>");
                var date = results[i].dt_txt;
                var setD = date.substr(0, 10)
                var temp = results[i].main.temp;
                var tempConv = (temp - 273.15) * 1.8 + 32;
                var hum = results[i].main.humidity;

                var h5date = $("<h5 class='card-title'>").text(setD);
                var pTemp = $("<p class='card-text'>").text("Temp: " + tempConv.toFixed(0) + "°F");;
                var pHum = $("<p class='card-text'>").text("Humidity: " + hum);;
                var weatherIcon = results[i].weather[0].icon;
                var weathericonUrl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
                var wIcon = $('<img>').attr("src", weathericonUrl);
                wIcon.attr("style", "height: 40px; width: 40px");

                forecastDiv.append(h5date);
                forecastDiv.append(wIcon);
                forecastDiv.append(pTemp);
                forecastDiv.append(pHum);
                $(".fiveday").append(forecastDiv);
            }
            saveToLocalStorage(cityArray);
        });
    }

    //   Put object into localstorage
    function initializeLocalStorage() {
        var storage = JSON.parse(localStorage.getItem('cityArray'));
        if(storage){
            cityArray = storage;
           
            var city = cityArray[cityArray.length - 1];
            buildQueryURL(city);
            console.log(city);
            updatePage(city);
        }
        
    }

    function saveToLocalStorage(city) {
        localStorage.setItem('cityArray', JSON.stringify(city));
    }

    // Function to empty out the articles
    function clear() {
        $(".city-results").empty();
        $(".fiveday").empty();
        $("#search-city").val("");
    }

    $(".submitbtn").on("click", function (event) {

        event.preventDefault();

        cityName = $("#search-city")
            .val()
            .trim();


        buildQueryURL(cityName);
        updatePage(cityName);
        clear();
    });
    $(document).on('click', '.city', function (event) {
        event.preventDefault();
        clear();
        cityName = $(this).text();
        console.log('Button Clicked');

        buildQueryURL(cityName);
        updatePage(cityName);
    });
});

    
