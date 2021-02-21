var coordinates;
var cityInfoEl = $(".cityInfo");
var tempEl = $(".temp");
var humidityEl = $(".humidity");
var windSpeedEl = $(".windSpeed");
var uvIndexEl = $(".uvIndex");
var currentIcon = $(".currentIcon");
var currentDate = $(".currentDate");

function getForecast(cityName) {

    var city = cityName.trim();
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=c86c87e5937343a2b3c7326be88ccf19"

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var lat = response.city.coord.lat;
        var lon = response.city.coord.lon;
        console.log(lat, lon);

        var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely,alert&appid=7e5813874d0192f2d42018c690376afc"
        $.ajax({
            url: queryUrl,
            method: "GET"

        }).then(function (response) {

            console.log("5 day", response);
            createFiveDay(response);
            var date = new Date(response.current.dt * 1000);
            var textDate = `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
            currentDate.text(textDate);


            cityInfoEl.text(city[0].toUpperCase() + city.slice(1) + "");
            tempEl.text("Temperature: " + response.current.temp + " F"); 
            humidityEl.text("Humidity: " + response.current.humidity + "%");
            windSpeedEl.text("Wind Speed: " + response.current.wind_speed + "MPH");
            uvIndexEl.text("UV Index: " + response.current.uvi);
            currentIcon.src= `http://openweathermap.org/img/wn/${response.current.weather[0].icon}@2x.png`

        })
    })
}


$(".searchBtn").on("click", function (event) {
    event.preventDefault();
    if ($(".search").val() != null) {
        getForecast($(".search").val());
    }
})  

    function createFiveDay (object){
        let container = document.getElementById("fiveDay");
        object.daily.forEach((forecast, index)=> {
            if(index <5) {
            let card = document.createElement("div");
            card.classList.add("col-md-3");
            let dateContainer = document.createElement("div");
            dateContainer.classList.add("date");
            dateContainer.innerHTML = getDay()[new Date ( forecast.dt * 1000).getDay()];
            card.appendChild(dateContainer);
            let img = document.createElement("img");
            img.classList.add("icon");
            img.src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
            img.alt = forecast.weather[0].description;
            card.appendChild(img);
            let temp = document.createElement("div");
            temp.classList.add("temp");
            temp.innerHTML=`${forecast.temp.day.toFixed(0)}&deg;`;
            card.appendChild(temp);
            let hum = document.createElement("div");
            hum.classList.add("hum");
            hum.innerHTML=`${forecast.humidity}%`;
            card.appendChild(hum);          
            container.appendChild(card);}
        })
    }
    function getDay (){
        let days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thuresday",
            "Friday",
            "Saturday"
        ];
        return days; 
    }

    