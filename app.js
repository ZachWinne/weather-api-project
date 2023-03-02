const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

require("dotenv").config();
const weatherAPI = process.env.OPEN_WEATHER_API_KEY;

const app = express();

const port = 3000;


app.use(bodyParser.urlencoded( {extended: true} ));


app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})


app.post('/', (req, res) => {

  // Constructing URL
  const baseURL = "https://api.openweathermap.org/data/2.5/weather";
  const userRequestedCity = req.body.userRequestedCity;
  const city = "?q=" + userRequestedCity
  const appID = "&appid=" + weatherAPI;
  const units = "&units=imperial";
  const url = baseURL + city + appID + units; 
  
 
  https.get(url, (response) => {
    response.on('data', (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description; 
      const icon = weatherData.weather[0].icon;
      const iconSRC = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write("<h1>The temp in " + userRequestedCity + " is: " + temp + " degrees F</h1>");
      res.write("<p>The weather is currently: " + weatherDescription + "");
      res.write("<img src=" + iconSRC + "></p>");

      res.send();
    })
  })
})


app.listen(port, () => {
  console.log("Server running on port " + port + "...");
})