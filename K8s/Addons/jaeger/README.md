# Port Jaeger-operator and Jaeger all-in-one to ARM64 cpu architecture for RaspberryPi 4 with Ubuntu 20.10 and Microk8s v1.9
Jaeger is a distributed tracing system. It is deployed into a K8s cluster using the Jaeger-operator, a K8s operator. The source code for Jeager-operator can be found at [github](https://github.com/jaegertracing/jaeger-operator)

Jaeger is previously included in microk8s by a deployment called `simplest`, which is from the `all-in-one` image ([more details of all-in-one](https://www.jaegertracing.io/docs/1.8/getting-started/#all-in-one)).

## Golang source file porting

Jaeger-operator does have a multi-arch image to support arm64 at [Docker Hub](https://hub.docker.com/r/jaegertracing/jaeger-operator/tags?page=1&ordering=last_updated). But the `all-in-one` docker image [](https://hub.docker.com/r/jaegertracing/all-in-one/tags?page=1&ordering=last_updated) the operator uses does **NOT** have an arm64 build. To make the problem worse, the `all-in-one` image url is embedded into the opertaor's source code. 

There is a multi-arch `all-in-one` docker image from querycap, [querycapistio/all-in-one:1.21.0](querycapistio/all-in-one:1.21.0)

So we need to change the [pkg/deployment/all_in_one.go](https://github.com/jaegertracing/jaeger-operator/blob/master/pkg/deployment/all_in_one.go) by the following and make a new docker image.
```diff
diff --git a/pkg/deployment/all_in_one.go b/pkg/deployment/all_in_one.go
index 66ebcb0c..8d48789c 100644
--- a/pkg/deployment/all_in_one.go
+++ b/pkg/deployment/all_in_one.go
@@ -131 +131 @@ func (a *AllInOne) Get() *appsv1.Deployment {
-						Image: util.ImageName(a.jaeger.Spec.AllInOne.Image, "jaeger-all-in-one-image"),
+						Image: "querycapistio/all-in-one:1.20.0",
```


## Docker image porting

Jaeger-operator's Makefile(https://github.com/jaegertracing/jaeger-operator/blob/master/Makefile) has an existing directive to build a docker multi-arch image. 
```bash
.PHONY: dockerx
dockerx:
	@[ ! -z "$(PIPELINE)" ] || docker buildx build --push --progress=plain --build-arg=JAEGER_VERSION=${JAEGER_VERSION} --build-arg=GOPROXY=${GOPROXY} --platform=$(PLATFORMS) --file build/Dockerfile $(IMAGE_TAGS) .
```

Reuse this directive `make buildx` and replace the `$(IMAGE_TAGS)` to push a local build image to any docker hub

## microk8s yaml file porting

The original jaeger yaml files are from [here](https://github.com/ubuntu/microk8s/tree/master/microk8s-resources/actions/jaeger). The only file needs to be changed is the `operator.yaml` by replacing the image url to the one built in the previous step.

