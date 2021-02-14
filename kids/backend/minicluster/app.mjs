import express from 'express';
import prometheus from 'express-prometheus-middleware';
import os from 'os';
import ip from 'ip';
import jaegerClient from 'jaeger-client';
import moment from 'moment';

// Jaeger code is from
// 1. https://github.com/nandobmont/express-jaeger
// 2. https://github.com/jaegertracing/jaeger-client-node
// 3. https://github.com/opentracing/opentracing-javascript
// 4. And express middleware, https://expressjs.com/en/guide/writing-middleware.html

/*import logger from 'fluent-logger';

logger.configure('miniWeather', {
  host: '10.152.183.59',
  port: 80,
  timeout: 3.0,
  reconnectInterval: 600000 // 10 minutes
});
logger.emit('weatherApi', {record: 'start'});
console.log('Node ip address = ', process.env.NODE_IP);*/

export const app = express();
const port = process.env.PORT || 3000; //app must listen $PORT in heroku. https://help.heroku.com/P1AVPANS/why-is-my-node-js-app-crashing-with-an-r10-error
export const server = app.listen(port);

app.use(prometheus({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

var config = {
  serviceName: 'miniweather',
  reporter: {
    // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
    // spans over HTTP
    collectorEndpoint: 'http://simplest-collector-headless:14268/api/traces',
    // Provide username and password if authentication is enabled in the Collector
    // username: '',
    // password: '',
  },
  sampler: { // mMust specify a sampler, otherwise, not tracing event reported
    type: "const",
    param: 1
  }
};
var options = {
  tags: {
    'miniweather-service.version': '1.0.0',
  },
  logger: {
    info: msg => {
      console.log("INFO ", msg);
    },
    error: msg => {
      console.log("ERROR", msg);
    }
  }
};
const tracer = jaegerClient.initTracer(config, options);
app.use((req, res, next) => {
  let { headers, path, url, method } = req;
  const span = tracer.startSpan(path);
  span.setTag("http.request.url", url);
  span.setTag("http.request.method", method);
  span.log({headers});

  res.once("finish", () => {
    span.setTag("http.response.status_code", res.statusCode);
    span.setTag("http.response.status_message", res.statusMessage);
    span.finish();
  });

  next();
});

app.get('/api/location/search', (req, res) => {
  console.log("fluentd: /api/location/search");

  res.status(200).json([
      {
        title: 'san jose',
        location_type: 'City',
        woeid: 2488042,
        latt_long: '37.338581,-121.885567',
        host: os.hostname(),
        port: port,
        ip: ip.address(),
        version: process.env.npm_package_version,
        datetime: moment().format('MMMM Do YYYY, h:mm:ss a')
      },
  ]);
});

app.get('/api/location/:woeid/', (req, res) => {
    res.status(200).json({
        consolidated_weather: [
          {
            id: 5135686724222976,
            weather_state_name: 'Light Cloud',
            weather_state_abbr: 'lc',
            wind_direction_compass: 'WNW',
            created: '2020-06-09T15:29:54.353063Z',
            applicable_date: '2020-06-09',
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

app.get('*', function(req, res){
  let { url } = req;
  res.send(`${url} is not found`, 200);
});