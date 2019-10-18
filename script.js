$(document).ready(function () {

  var cityScore = 0;

  function cityPost(city){
    $("." + cityScore).css("visibility", "visible");
    $("#p" + cityScore).text(city);
    cityScore++;
  }

  function cityButtons() {
    var dt = new Date();
    var dayDate = dt.toDateString();
    var APIKey = "f41f543f98f3462ad127a26ccbe65e6a";
    var city;

    if ($(this).hasClass("search")) {
      city = $("#search-input").val();
      cityPost(city);
    } else {
      city = $(this).text();
    }
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      console.log(response);

      //appending data to correct id's from AJAX response
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

      //setting data for five day forecast
      var array = [0, 8, 16, 24, 32];
      var array2 = [0, 6, 12, 18, 26];

      for (var i = 0; i <= 6; i++) {
        //setting date for day 0 - 5
        $("#fiveDate" + i).text(EpochToDate(response.list[array[i]].dt));
        //setting temp for day 0 - 5
        $("#five-temp" + i).text("Temp: " + Math.floor((response.list[array[i]].main.temp - 273.15) * 9 / 5 + 32) + " F");
        //setting humidity for day 0 - 5
        $("#hum" + i).text("Hum: " + response.list[array[i]].main.humidity + "%");

        //setting icons for day 0 -5
        var iconcode2 = response.list[array2[i]].weather[0].icon;
        var iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
        $("#five-icon" + i).attr("src", iconurl2);
        console.log(i);
      }

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

  function uvIndex(APIKey, lat, lon) {

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




