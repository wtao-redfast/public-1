# A Pingpong service to test k8s observability
A sample app to validate Jaeger tracing, Prometheus/Graphana metrics, and EFK logging. It also exposes itself through a local ingress

## The Ping Api
In the app.js, the ping api will return a `pong` response with additional debug information.

## Build the docker file
```bash
# create a new builder
docker buildx create --use --name pingpong

docker buildx build --push --platform=linux/arm64,linux/amd64 -t taowenwei/pingpong .

# remove the builder to free space
docker buildx rm pingpong
```