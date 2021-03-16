let apiKey="6a2b1a68729f1c9a68104b6a5173140d";
let searchBtn= $(".searchBtn");
let search= $(".search");

let cityNameEl= $(".cityName");
let currentDateEl= $(".currentDate");
let weatherIconEl= $(".weatherIcon");
let searchHistoryEl= $(".historyItems");

let tempEl= $(".temp");
let windSpeedEl= $(".windSpeed");
let humidityEl= $(".humidity");
let uvIndexEl= $(".uvIndex");
let cardRow= $(".card-row");

var today= new Date();
let dd= String(today.getDate()).padStart(2, '0');
let mm= String(today.getMonth()+ 1).padStart(2,'0');
let yyyy= today.getFullYear();
var today= mm + '/' + dd + '/' + yyyy;

if(JSON.parse(localStorage.getItem("searchHistory"))=== null) {
    console.log("searchHistory not found")
} else{
    console.log("searchHistoy loaded into searchHistoryArr");
    renderSearchHistory();
}

searchBtn.on("click", function(e) {
    e.preventDefault();
    if (searchInput.val()===""){
        alert("Enter City Name");
        return;
    }
    console.log("clicked button")
    getWeather(searchInput.val());
});

$(document).on("click", ".historyEntry", function(){
    console.log("clicked history item")
    let thisElement= $(this);
    getWeather(thisElement.text());
})

function renderSearchHistory(cityName){
    searchHistoryEl.empty();
    let searchHistoryArr= JSON.parse(localStorage.getItem("searchHistory"));
    for (let i=0; i< searchHistoryArr.length; i++){
        let newListItem= $("<li>").attr("class", "historyEntry");
        newListItem.text(searchHistoryArr[i]);
        searchHistoryEl.prepend(newListItem);
    }
}

function renderWeatherData(cityName, cityTemp, cityWindSpeed, cityHumidity, cityWeatherIcon, uvVal){
 cityNameEl.text(cityName)
 currentDateEl.text('(${today})')
 tempEl.text('Temperature; ${cityTemp} F');
 windSpeedEl.text('Wind Speed: ${cityWindSpeed} MPH');
 humidityEl.text('Humidity: ${cityHumidity}%');
 uvIndexEl.text('UV Index: ${uvVal');
 weatherIconEl.attr("src", cityWeatherIcon);
}

function getWeather(desiredCity) {
    let queryUrl= 'api.openweathermap.org/data/2.5/forecast?q={city name}&appid={6a2b1a68729f1c9a68104b6a5173140d}';
    $.ajax({
        url: queryUrl,
        method: "GET"
    }) 
   .then(function(weatherData){
       let cityObj= {
           cityName: weatherData.name,
           cityTemp: weatherData.main.temp,
           cityWindSpeed: weatherData.main.speed,
           cityHumidity: weatherData.main.humidity,
           cityUVIndex: weatherData.coord,
           cityWeatherIconName: weatherData.weather[0].icon
       }
       let queryUrl= 'api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${6a2b1a68729f1c9a68104b6a5173140d}'
       $.ajax({
           url: queryUrl,
           method: 'GET'
       })
       .then(function(uvData){
           if (JSON.parse(localStorage.getItem("searchHistory"))=== null){
               let searchHistoryArr= [];
               if (searchHistoryArr.indexOf(cityObj.cityName)=== -1){
                   searchHistoryArr.push(cityObj.cityName);
                   localStorage.setItem("searchHistoy", JSON.stringify(searchHistoryArr));
                   let renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityWindSpeed, cityObj.cityHumidity, renderedWeatherIcon, uvData.value);

               }
           }else{
               let searchHistoryArr= JSON.parse(localStorage.getItem("searchHistory"));
               if (searchHistoryArr.indexOf(cityObj.cityName)=== -1) {
                   searchHistoryArr.push(cityObj.cityName);
                   localStorage.setItom("searchHistoy", JSON.stringify(searchHistoryArr));
                   let renderedWeatherIcon= 'https:///openweathermap.org/img/w/10d/${cityObj.cityWeatherIconName}.png';
                   renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityWindSpeed, cityObj.cityHumidity, renderedWeatherIcon, uvData.value);
                   renderSearchHistory(cityObj.cityName);
               }else{
                console.log("City already in searchHistory. Not adding to list")
                let renderedWeatherIcon = `https:///openweathermap.org/img/w/10d/${cityObj.cityWeatherIconName}.png`;
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityWindSpeed, cityObj.cityHumidity, renderedWeatherIcon, uvData.value);

               }
           }
       })
   });
   
   getFiveDayForecast();

   function getFiveDayForecast() {
       cardRow.empty();
       let queryUrl= 'api.openweathermap.org/data/2.5/forecast?q={city name}&appid={6a2b1a68729f1c9a68104b6a5173140d}';
       $.ajax({
        url: queryUrl,
        method: "GET"
    })
    .then(function(fiveDayReponse) {
        for (let i = 0; i != fiveDayReponse.list.length; i+=8 ) {
            let cityObj = {
                date: fiveDayReponse.list[i].dt_txt,
                icon: fiveDayReponse.list[i].weather[0].icon,
                temp: fiveDayReponse.list[i].main.temp,
                humidity: fiveDayReponse.list[i].main.humidity
            }
            let dateStr = cityObj.date;
            let trimmedDate = dateStr.substring(0, 10); 
            let weatherIco = `https://openweathermap.org/img/w/10d.png`;
            createForecastCard(trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
        }
    })
}
}

function createForecastCard(date, icon, temp, humidity){
    let fiveDayCardEl = $("<div>").attr("class", "five-day-card");
    let cardDate = $("<h3>").attr("class", "card-text");
    let cardIcon = $("<img>").attr("class", "weatherIcon");
    let cardTemp = $("<p>").attr("class", "card-text");
    let cardHumidity = $("<p>").attr("class", "card-text");

    cardRow.append(fiveDayCardEl);
    cardDate.text(date);
    cardIcon.attr("src", icon);
    cardTemp.text(`Temp: ${temp} °F`);
    cardHumidity.text(`Humidity: ${humidity}%`);
    fiveDayCardEl.append(cardDate, cardIcon, cardTemp, cardHumidity);   
}
