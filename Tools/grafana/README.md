# Install and run grafana on Mac
Direct install
```bash
brew install grafana
```

To have launchd start grafana now and restart at login:
```bash
brew services start grafana
```
Or, if you don't want/need a background service you can just run:
```bash
grafana-server --config=/usr/local/etc/grafana/grafana.ini --homepath /usr/local/share/grafana --packaging=brew cfg:default.paths.logs=/usr/local/var/log/grafana cfg:default.paths.data=/usr/local/var/lib/grafana cfg:default.paths.plugins=[/Users/wenweitao/Documents/public/Tools/grafana/panel-plugin] <- your plugins path
```