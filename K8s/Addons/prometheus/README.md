# Port Prometheus to ARM64 cpu architecture for RaspberryPi 4 with Ubuntu 20.10 and Microk8s v1.9

## Prometheus yaml original source
microk8s v1.9 fetches Prometheus yamls from [v0.6.0](https://github.com/prometheus-operator/kube-prometheus).
```bash
# excerpt from enable.prometheus.sh

get_kube_prometheus () {
  if [  ! -d "${SNAP_DATA}/kube-prometheus" ]
  then
    KUBE_PROMETHEUS_VERSION="v0.6.0"
    KUBE_PROMETHEUS_ERSION=$(echo $KUBE_PROMETHEUS_VERSION | sed 's/v//g')
    echo "Fetching kube-prometheus version $KUBE_PROMETHEUS_VERSION."
    ...
}
```
So we will download the manifest files from 0.6.0 as our baseline.

## Update images' urls

```diff
diff --git a/manifests/alertmanager-alertmanager.yaml b/manifests/alertmanager-alertmanager.yaml
index 55b353a..d11c6a9 100644
--- a/manifests/alertmanager-alertmanager.yaml
+++ b/manifests/alertmanager-alertmanager.yaml
@@ -9 +9 @@ spec:
-  image: quay.io/prometheus/alertmanager:v0.21.0
+  image: quay.io/prometheus/alertmanager-linux-arm64:v0.21.0
@@ -12 +12 @@ spec:
-  replicas: 3
+  replicas: 1
diff --git a/manifests/kube-state-metrics-deployment.yaml b/manifests/kube-state-metrics-deployment.yaml
index 970f987..b13d0c1 100644
--- a/manifests/kube-state-metrics-deployment.yaml
+++ b/manifests/kube-state-metrics-deployment.yaml
@@ -26 +26 @@ spec:
-        image: quay.io/coreos/kube-state-metrics:v1.9.5
+        image: k8s.gcr.io/kube-state-metrics/kube-state-metrics:v2.0.0-alpha.2
@@ -33 +33 @@ spec:
-        image: quay.io/coreos/kube-rbac-proxy:v0.4.1
+        image: quay.io/brancz/kube-rbac-proxy:v0.8.0-arm64
@@ -45 +45 @@ spec:
-        image: quay.io/coreos/kube-rbac-proxy:v0.4.1
+        image: quay.io/brancz/kube-rbac-proxy:v0.8.0-arm64
diff --git a/manifests/node-exporter-daemonset.yaml b/manifests/node-exporter-daemonset.yaml
index eae2e47..eaafb6a 100644
--- a/manifests/node-exporter-daemonset.yaml
+++ b/manifests/node-exporter-daemonset.yaml
@@ -28 +28 @@ spec:
-        image: quay.io/prometheus/node-exporter:v0.18.1
+        image: quay.io/prometheus/node-exporter-linux-arm64:v0.18.1
@@ -58 +58 @@ spec:
-        image: quay.io/coreos/kube-rbac-proxy:v0.4.1
+        image: quay.io/brancz/kube-rbac-proxy:v0.8.0-arm64
diff --git a/manifests/prometheus-adapter-deployment.yaml b/manifests/prometheus-adapter-deployment.yaml
index 6f7c673..f825949 100644
--- a/manifests/prometheus-adapter-deployment.yaml
+++ b/manifests/prometheus-adapter-deployment.yaml
@@ -28 +28 @@ spec:
-        image: directxman12/k8s-prometheus-adapter:v0.7.0
+        image: directxman12/k8s-prometheus-adapter-arm64:v0.7.0
diff --git a/manifests/prometheus-prometheus.yaml b/manifests/prometheus-prometheus.yaml
index af520a8..e22a7c7 100644
--- a/manifests/prometheus-prometheus.yaml
+++ b/manifests/prometheus-prometheus.yaml
@@ -14 +14 @@ spec:
-  image: quay.io/prometheus/prometheus:v2.20.0
+  image: prom/prometheus-linux-arm64:v2.20.0
@@ -19 +19 @@ spec:
-  replicas: 2
+  replicas: 1
diff --git a/manifests/setup/prometheus-operator-deployment.yaml b/manifests/setup/prometheus-operator-deployment.yaml
index 08cd3a7..3f30b3b 100644
--- a/manifests/setup/prometheus-operator-deployment.yaml
+++ b/manifests/setup/prometheus-operator-deployment.yaml
@@ -27,3 +27,3 @@ spec:
-        - --config-reloader-image=jimmidyson/configmap-reload:v0.4.0
-        - --prometheus-config-reloader=quay.io/prometheus-operator/prometheus-config-reloader:v0.42.1
-        image: quay.io/prometheus-operator/prometheus-operator:v0.42.1
+        - --config-reloader-image=jimmidyson/configmap-reload:v0.3.0
+        - --prometheus-config-reloader=quay.io/coreos/prometheus-config-reloader:v0.40.0-arm64
+        image: quay.io/coreos/prometheus-operator:v0.40.0-arm64
@@ -48 +48 @@ spec:
-        image: quay.io/coreos/kube-rbac-proxy:v0.4.1
+        image: quay.io/brancz/kube-rbac-proxy:v0.8.0-arm64
```

## Configure and access Grafana from kubectl proxy

Grafana GUI can be accessed through [kubectl proxy](https://kubernetes.io/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api). But many of the links in the Grafana GUI are broken, as reported [here](https://github.com/grafana/grafana/issues/13459).

Grafana has two configuration flags, `serve_from_sub_path` and `root_url`,  to fix the links by inserting a base path (similar to Kibana's `SERVER_BASEPATH`).

All options in the grafana configuration [file](https://github.com/grafana/grafana/blob/master/conf/defaults.ini) can be overridden by using environment variables. More details at [here](https://grafana.com/docs/grafana/latest/administration/configuration/#configure-with-environment-variables).

Thus we can modify the `grafana-deployment.yaml` file to fix the issue.

```diff
diff --git a/K8s/Addons/prometheus/manifests/grafana-deployment.yaml b/K8s/Addons/prometheus/manifests/grafana-deployment.yaml
index d4cc0f9..ccd9239 100644
--- a/K8s/Addons/prometheus/manifests/grafana-deployment.yaml
+++ b/K8s/Addons/prometheus/manifests/grafana-deployment.yaml
@@ -16,7 +16,11 @@ spec:
         app: grafana
     spec:
       containers:
-      - env: []
+      - env:
+        - name: GF_SERVER_ROOT_URL
+          value: /api/v1/namespaces/monitoring/services/http:grafana:3000/proxy
+        - name: GF_SERVER_SERVE_FROM_SUB_PATH
+          value: "true"
         image: grafana/grafana:7.1.0
```


