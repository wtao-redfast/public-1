import express from 'express';
import os from 'os';
import ip from 'ip';
import moment from 'moment';
import jaegerware from './fluentd-middle.js';
import prometheus from 'express-prometheus-middleware';

export const app = express();
const port = 3000;
export const server = app.listen(port);

app.use(jaegerware);

app.use(prometheus({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

app.get('/ping', (req, res) => {
  console.log(`/ping is invoked from ${req.connection.remoteAddress}`);

  res.status(200).json([
      {
        response: 'pong',
        host: os.hostname(),
        ip: ip.address() + ':' + port.toString(),
        client: req.connection.remoteAddress,
        version: process.env.npm_package_version,
        datetime: moment().format('MMMM Do YYYY, h:mm:ss a')
      },
  ]);
});

app.get('*', function(req, res){
  let { url } = req;
  res.send(`${url} is not found`, 200);
});