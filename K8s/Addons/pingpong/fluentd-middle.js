import jaegerClient from "jaeger-client";

// Jaeger code is from
// 1. https://github.com/nandobmont/express-jaeger
// 2. https://github.com/jaegertracing/jaeger-client-node
// 3. https://github.com/opentracing/opentracing-javascript
// 4. And express middleware, https://expressjs.com/en/guide/writing-middleware.html
var config = {
    serviceName: "pingpong",
    reporter: {
        // Provide the traces endpoint; this forces the client to connect directly to the Collector and send
        // spans over HTTP
        collectorEndpoint:
            "http://simplest-collector-headless:14268/api/traces",
        // Provide username and password if authentication is enabled in the Collector
        // username: '',
        // password: '',
    },
    sampler: {
        // mMust specify a sampler, otherwise, not tracing event reported
        type: "const",
        param: 1,
    },
};
var options = {
    tags: {
        "pingpong-service.version": "1.0.0",
    },
    logger: {
        info: (msg) => {
            console.log("INFO ", msg);
        },
        error: (msg) => {
            console.log("ERROR", msg);
        },
    },
};
const tracer = jaegerClient.initTracer(config, options);

export default (req, res, next) => {
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
};
