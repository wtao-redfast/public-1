import express from "express";
import scout from "@scout_apm/scout-apm";

export const app = express();
app.use(scout.expressMiddleware());

const PORT = process.env.PORT || 3000; //app must listen $PORT in heroku. https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error
export const server = app.listen(PORT);

app.get("/api/location/search", (req, res) => {
    res.json([
        {
          title: "san jose",
          location_type: "City",
          woeid: 2488042,
          latt_long: "37.338581,-121.885567",
        },
    ]);
});

app.get("/api/location/:woeid/", (req, res) => {
    res.json({
        consolidated_weather: [
          {
            id: 5135686724222976,
            weather_state_name: "Light Cloud",
            weather_state_abbr: "lc",
            wind_direction_compass: "WNW",
            created: "2020-06-09T15:29:54.353063Z",
            applicable_date: "2020-06-09",
            min_temp: 15.135,
            max_temp: 29.14,
            the_temp: -1.0,
            wind_speed: 4.166257675693948,
            wind_direction: 301.0129815794667,
            air_pressure: 1020.5,
            humidity: 30,
            visibility: 16.7484391155651,
            predictability: 70,
          },
        ],
      });
});

app.get("/api/about", (req, res) => {
    res.json({
        version: "1.2"
    });
});
