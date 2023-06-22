const express = require("express");
const https = require("https");
const app = express();
const port = 3000;
const path = require("path");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const cityName = req.body.cityname;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=ca898690a33a67ddf28469e32af83d70&units=metric`;
    https.get(url, function (response) {
      response.on("data", (data) => {
        const weatherData = JSON.parse(data);
        const description = weatherData.weather[0].description;
        const temprature = weatherData.main.temp;
        const icon = weatherData.weather[0].icon;
        const imgurl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Weather App</title>
              <style>
              body {
                background-size: cover;
                background: rgb(2, 0, 36);
                background: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(25, 201, 195, 1) 100%);
                background-attachment: fixed;
                overflow: hidden;
                width: 100vw;
                max-width: 100vw;
                height: 100vh;
                max-height: 100vh;
            }
            .container {
              overflow: hidden;
              width: 100vw;
              max-width: 100vw;
              height: 80vh;
              max-height: 100vh;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
          }
          .main-wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(3.9px);
            -webkit-backdrop-filter: blur(3.9px);
            border: 1px solid rgba(255, 255, 255, 0.48);
            max-width: 80vh;
            width: 100%;
            padding: 71px 20px;
          }
          h1{
            font-family: 'Dancing Script', cursive;
            font-size: 50px;
            color: #ffffffde;
            text-align: center;
            margin-top: 50px;
          }
          h2{
            color: #fff;
            font-weight: 400;
            font-size: 30px;
            text-align:center
          }
          h2 b{
            color: #11172f;
          }
          p{
            color: #fff;
            font-weight: 400;
            font-size: 25px;
            margin-top: 0;
          }
          p span{
            color: #11172f;
          }
              </style>
            </head>
            <body>
            <h1 class="heading">Weather APP</h1>
            <div class="container">
            <div class="main-wrapper">
            <h2>The weather in <b> ${cityName}</b> is <b> ${description} </b> </h2>
            <p>Temprature: <span>${temprature} </span> </p>
            <img src=${imgurl}>
            </div>
            </div>
            </body>
          </html>
        `;
        res.send(html);
      });
    });
  } catch (error) {
    res.status(500).send("An error occurred.");
  }
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
