const ejs = require('ejs');
const express = require('express');
const https = require('https');
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

var query = "";
var temp="";
var imgURL="";
var weatherdescription="";
var status="";
var minTemp = "";
var maxTemp = "";
var feelsLike = "";
var pressure = "";
var humidity = "";
var wind = "";

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res){
    res.render("weather",{query:query, temp:temp, imgURL:imgURL, weatherdescription:weatherdescription, status:status, mint: minTemp, maxt: maxTemp, flike: feelsLike, press: pressure, hum: humidity, wspeed: wind});
});

app.post("/", function(req,res){
    query = req.body.cityname;
    const apikey = process.env.API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units=metric&appid="+apikey;
    https.get(url, function(response){
        status = response.statusCode;
        //console.log(status);
        response.on("data",function(data){
            const weatherdata = JSON.parse(data);
            if(status=="200"){
            temp = weatherdata.main.temp;
            weatherdescription = weatherdata.weather[0].description;
            const icon = weatherdata.weather[0].icon;
            imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
            minTemp = weatherdata.main.temp_min + " °C";
            maxTemp = weatherdata.main.temp_max + " °C";
            feelsLike = weatherdata.main.feels_like + " °C";
            pressure = weatherdata.main.pressure + " hPa";
            humidity = weatherdata.main.humidity + " %";
            wind = weatherdata.wind.speed + " m/s";}
            res.redirect("/");
        })
    })
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Server running on port 3000');
});