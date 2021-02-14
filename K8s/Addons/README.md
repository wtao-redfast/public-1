# Enable mirok8s v1.19 observability on Raspberry Pi 4
An attempt to restore the observability suite for the microk8s v1.19 on Raspberry Pi 4(arm64) + Ubuntu 20.10 server. The issue is reported at [Microk8s github](https://github.com/ubuntu/microk8s/issues/1706)

## Port EFK stack - logging
[Instructions](ElasticFluentKibana/README.md)

## Porting jaeger - tracing
[Instructions](jaeger/README.md)

## Porting Prometheus - metrics
[Instructions](prometheus/README.md)

## The Pingpong servcice
An sample pingpong service is created to validate the porting, more details at [here](pingpong/README.md)