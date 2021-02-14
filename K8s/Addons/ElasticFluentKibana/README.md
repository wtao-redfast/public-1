# Port EFK stack to ARM64 cpu architecture for RaspberryPi 4 with Ubuntu 20.10 and Microk8s v1.9

# Table of Contents
1. [The Stack: Fluentd(v3.1.0) + Elasticsearch(oss:v7.9.3) + Kibana(oss:v7.9.3)](#stack)
2. [Porting instructions](#porting)
    1. [Elasticsearch for fluentd](#porting_es)
        - [Dockerfile](#porting_es_docker)
        - [k8s/microk8s Yaml](#porting_es_yaml)
    2. [Fluentd](#porting_fluentd)
        - [Dockerfile](#porting_fluentd_docker)
        - [k8s/microk8s Yaml](#porting_fluentd_yaml)
    3. [Kibana](#porting_kibana)
        - [Dockerfile](#porting_kibana_docker)
        - [k8s/microk8s Yaml](#porting_kibana_yaml)


## The Stack: Fluentd(v3.1.0) + Elasticsearch(oss:v7.9.3) + Kibana(oss:v7.9.3) <a name="stack"></a>
Origin dockerfile, yaml file sources are from: 
1. [Kubernetes](https://github.com/kubernetes/kubernetes/tree/master/cluster/addons/fluentd-elasticsearch)
2. [Microk8s](https://github.com/ubuntu/microk8s/tree/master/microk8s-resources/actions/fluentd)
3. [ElasticSearch Dockerfiles](https://github.com/elastic/dockerfiles) - _Those Dockerfiles were generated from the products' own repositories_

What is the elastic [OSS](https://www.elastic.co/what-is/open-x-pack) version? 

**Elasticsearch version has to [match](https://github.com/elastic/kibana#version-compatibility-with-elasticsearch) with kibana version.**


## Porting instructions <a name="porting"></a>

### 1. Elasticsearch for fluentd at `fluentd-elasticsearch/es-image` <a name="porting_es"></a>
- Docker image porting <a name="porting_es_docker"></a>

The [oss:v7.9.3](https://hub.docker.com/_/elasticsearch?tab=tags&page=1&ordering=last_updated) supports arm64 natively. Thus the only change is to update the original [Dockerfile](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/fluentd-elasticsearch/es-image/Dockerfile) with,
```docker
FROM docker.elastic.co/elasticsearch/elasticsearch-oss:7.9.3
```

Run build scripts in the `fluentd-elasticsearch/es-image` folder to build and push (docker hub) an image with both amd64 and arm64,
```bash
# create a new builder
docker buildx create --use --name esimage

docker buildx build --push --platform=linux/arm64,linux/amd64 -t taowenwei/efk-elasticsearch-oss:v7.9.3 .

# remove the builder to free space
docker buildx rm esimage
```

Additional reference to [Docker support multi-CPU architecture](https://docs.docker.com/docker-for-mac/multi-arch/), [docker buildx](https://docs.docker.com/docker-for-mac/multi-arch/)

- k8s/microk8s yaml file porting <a name="porting_es_yaml"></a>

Yaml changes are minimal and in the original [es-statefulset.yaml](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/fluentd-elasticsearch/es-statefulset.yaml) only. 

<img src="_images/es-statefulset.png" with="300" height="237"/>

### 2. Fluentd at `fluentd-elasticsearch/fluentd-es-image` <a name="porting_fluentd"></a>
- Docker image porting <a name="porting_fluentd_docker"></a>

Fluentd uses libjemalloc2 [amd64](https://debian.pkgs.org/10/debian-main-amd64/libjemalloc2_5.1.0-3_amd64.deb.html), [arm64](https://debian.pkgs.org/10/debian-main-arm64/libjemalloc2_5.1.0-3_arm64.deb.html). The binaries are installed in different directories in your file system. Fluentd also requires that the `LD_PRELOAD` is set to the proper `libjemalloc2` prior to run itself. 

Thus the original [Dockerfile](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/fluentd-elasticsearch/fluentd-es-image/Dockerfile) needs to remove the following line,
```docker
ENV LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2
```

Then, the original [entrypoint.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/fluentd-elasticsearch/fluentd-es-image/entrypoint.sh) to add the following lines to export the `LD_PRELOAD` before the `exec` command,

```bash
if [ -d "/usr/lib/aarch64-linux-gnu" ];
    then export LD_PRELOAD=/usr/lib/aarch64-linux-gnu/libjemalloc.so.2;
    else export LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2;
fi
```

Run build scripts in the `fluentd-elasticsearch/fluentd-es-image` folder to build and push (docker hub) an image with both amd64 and arm64,
```bash
# create a new builder
docker buildx create --use --name fluentd

docker buildx build --push --platform=linux/arm64,linux/amd64 -t taowenwei/efk-fluentd:v3.1.0 .

# remove the builder to free space
docker buildx rm fluentd
```

- k8s/microk8s yaml file porting <a name="porting_fluentd_yaml"></a>

In the original `fluentd-es-configmap.yaml` file [k8s version](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/fluentd-elasticsearch/fluentd-es-configmap.yaml), [microk8s version](https://github.com/ubuntu/microk8s/blob/master/microk8s-resources/actions/fluentd/fluentd-es-configmap.yaml), you may further customerize how to connect with elasticsearch based on [this page](https://docs.fluentd.org/output/elasticsearch).

In the original `fluentd-es-ds.yaml` file [k8s version](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/fluentd-elasticsearch/fluentd-es-ds.yaml), [microk8s version](https://github.com/ubuntu/microk8s/blob/master/microk8s-resources/actions/fluentd/fluentd-es-ds.yaml), you need to update the image path and may change the various version numbers.

In the `fluentd-es-ds.yaml` file, you can also use the `-v` option over `-q` for verbose output. More command line options for fluentd can be found [here](https://docs.fluentd.org/deployment/command-line-option)
```yaml
- name: FLUENTD_ARGS
  value: --no-supervisor -v
```

**IMPORTANT:** There is a major difference in the `fluentd-es-ds.yaml` between its k8s and microk8s version. Failed to use the correct version will prevent the elasticsearch from creating a `logstash-***` index.
<img src="_images/fluentd_varlibdockercontainers.png" with="500" height="65"/>

## 3. Kibana at `kibana` <a name="porting_kibana"></a>
- Docker image porting <a name="porting_kibana_docker"></a>

Kibanan dockerfile is actually generated from [Kibana build tasks](https://github.com/elastic/kibana/tree/master/src/dev/build/tasks/os_packages/docker_generator). But we can use the existing one from [ElasticSearch Dockerfiles](https://github.com/elastic/dockerfiles) as our porting base.

Kibana sources for amd64 and arm64 are in [different locations](https://www.elastic.co/downloads/past-releases/kibana-oss-7-9-3). 
Thus in the original [Dockerfile](https://github.com/elastic/dockerfiles/blob/7.10/kibana/Dockerfile), we add

```bash
ARG TARGETARCH
RUN if [ "$TARGETARCH" == "arm64" ]; \
    then curl --retry 8 -L https://artifacts.elastic.co/downloads/kibana/kibana-oss-7.9.3-linux-aarch64.tar.gz -o /opt/kibana-7.9.3-linux.tar.gz; \
    else curl --retry 8 -L https://artifacts.elastic.co/downloads/kibana/kibana-oss-7.9.3-linux-x86_64.tar.gz -o /opt/kibana-7.9.3-linux.tar.gz; \
    fi
```

Kibana is launched by [dumb-init](https://github.com/Yelp/dumb-init/releases/tag/v1.2.2). we also need to fix the `dumb-init` with correct CPU arch
```bash
ARG TARGETARCH
RUN if [ "$TARGETARCH" == "arm64" ]; \
    then curl -L -o /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_aarch64; \
    else curl -L -o /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64; \
    fi
```

Run build scripts in the `kibana` folder to build and push (docker hub) an image with both amd64 and arm64,
```bash
# create a new builder
docker buildx create --use --name kibana

docker buildx build --push --platform=linux/arm64,linux/amd64 -t taowenwei/efk-kibana-oss:v7.9.3 .

# remove the builder to free space
docker buildx rm kibana
```

- k8s/microk8s yaml file porting <a name="porting_kibana_yaml"></a>

In the original `kibana-deployment.yaml` file [k8s version](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/fluentd-elasticsearch/kibana-deployment.yaml), [microk8s version](https://github.com/ubuntu/microk8s/blob/master/microk8s-resources/actions/fluentd/kibana-deployment.yaml), the kibana image path needs to be updated.

In the original `kibana-deployment.yaml` file, the following `env` parameters are also required to be configured

1. `ELASTICSEARCH_HOSTS`: (also you can set in the `elasticsearch.hosts` field in the [config file](https://github.com/elastic/dockerfiles/blob/7.10/kibana/config/kibana.yml)) specifies the elastic search service url; e.g. http://elasticsearch-logging:9200
2. `SERVER_NAME`: specify the kibana server name; e.g.kibana-logging
3. `SERVER_HOST`: The default is localhost(127.0.0.1) which pervents external access. Set this value to (0.0.0.0), then in the server context, it binds to the all physical IP4 addresses assigned to the server, which is exactly what we want. [127.0.0.1 vs. 0.0.0.0](https://www.howtogeek.com/225487/what-is-the-difference-between-127.0.0.1-and-0.0.0.0/) 
4. `SERVER_BASEPATH`: If access to the kibana UI is through k8s proxy, you must set it to `/api/v1/namespaces/kube-system/services/http:kibana-logging:5601/proxy`; otherwise, the frontend will failed to load many of the js files. 