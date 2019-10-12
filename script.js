$(document).ready(function () {

  function cityButtons() {
    var dt = new Date();
    var dayDate = dt.toDateString();
    var APIKey = "f41f543f98f3462ad127a26ccbe65e6a";
    var city;

    if ($(this).hasClass("search")) {
      city = $("#search-input").val();
      console.log(city);
    } else {
      city = $(this).text();
    }

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      //pasting info to correct id's from AJAX response
      $("#city").text(response.name);
      $("#date").text(dayDate);
      $("#temp-output").text(Math.floor((response.main.temp - 273.15) * 9 / 5 + 32) + " F");
      $("#humidity-output").text(response.main.humidity + "%");
      $("#windspeed-output").text(response.wind.speed + " mph");
      //icon1
      var iconcode = response.weather[0].icon;
      var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
      $("#icon1").attr("src", iconurl);

      //getting latitutde and longitude for UV index
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      
      //calling UV Index function
      uvIndex(APIKey, lat, lon);

      //end ajax call
    });
    //calling five day forecast function
    fiveDay(city, APIKey);


    //end cityButtons() function
  }

  // Adding click event listeners to all elements with a class of "city-btn" and running cityButtons function
  $(document).on("click", ".city-btn", cityButtons);

  // ============================================================================================================

  function fiveDay(city, APIKey) {

    //second AJAX call for the five day forecast
    var queryURLFiveDay = "http://api.openweathermap.org/data/2.5/forecast?appid=" + APIKey + "&q=" + city + "&count=10";
    //api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml

    $.ajax({
      url: queryURLFiveDay,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      //setting data for day 0 - 5
      $("#fiveDate1").text(EpochToDate(response.list[0].dt));
      $("#fiveDate2").text(EpochToDate(response.list[8].dt));
      $("#fiveDate3").text(EpochToDate(response.list[16].dt));
      $("#fiveDate4").text(EpochToDate(response.list[24].dt));
      $("#fiveDate5").text(EpochToDate(response.list[32].dt));

      //setting temp for day 0 - 5
      $("#five-temp1").text("Temp: " + Math.floor((response.list[0].main.temp - 273.15) * 9 / 5 + 32) + " F");
      $("#five-temp2").text("Temp: " + Math.floor((response.list[8].main.temp - 273.15) * 9 / 5 + 32) + " F");
      $("#five-temp3").text("Temp: " + Math.floor((response.list[16].main.temp - 273.15) * 9 / 5 + 32) + " F");
      $("#five-temp4").text("Temp: " + Math.floor((response.list[24].main.temp - 273.15) * 9 / 5 + 32) + " F");
      $("#five-temp5").text("Temp: " + Math.floor((response.list[32].main.temp - 273.15) * 9 / 5 + 32) + " F");

      //setting humidity for day 0 - 5
      $("#hum1").text("Hum: " + response.list[0].main.humidity + "%");
      $("#hum2").text("Hum: " + response.list[6].main.humidity + "%");
      $("#hum3").text("Hum: " + response.list[12].main.humidity + "%");
      $("#hum4").text("Hum: " + response.list[18].main.humidity + "%");
      $("#hum5").text("Hum: " + response.list[26].main.humidity + "%");

      //setting icons for day 0 -5
      var iconcode2 = response.list[0].weather[0].icon;
      var iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
      $("#five-icon1").attr("src", iconurl2);
      //day 2
      iconcode2 = response.list[6].weather[0].icon;
      iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
      $("#five-icon2").attr("src", iconurl2);

      //day 3
      iconcode2 = response.list[12].weather[0].icon;
      iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
      $("#five-icon3").attr("src", iconurl2);

      //day 4
      iconcode2 = response.list[18].weather[0].icon;
      iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
      $("#five-icon4").attr("src", iconurl2);

      //day 5
      iconcode2 = response.list[26].weather[0].icon;
      iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
      $("#five-icon5").attr("src", iconurl2);


      //end ajax call
    });
    //end fiveDay function
  }

  function EpochToDate(epoch) {
    if (epoch < 10000000000)
      epoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
    var epoch = epoch + (new Date().getTimezoneOffset() * -1); //for timeZone        

    var x = new Date(epoch);
    var dayDate = x.toDateString();

    return dayDate;
  }
   
  function uvIndex(APIKey, lat, lon){
    
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;
    
    $.ajax({
      url: uvURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      
      //setting the uv Index
      $("#uv-output").text(response.value);
      
      
      //end AJAX call for uv Index
    });

    //end uvIndex function
  }

  //end document ready function
});




