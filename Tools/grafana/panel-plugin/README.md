# Build the plugin
https://grafana.com/tutorials/build-a-panel-plugin-with-d3/

```bash
yarn install
yarn dev
```

The build can be found at `dist` folder 

# Override the plugin path in command line

```bash
grafana-server --config=/usr/local/etc/grafana/grafana.ini --homepath /usr/local/share/grafana --packaging=brew cfg:default.paths.logs=/usr/local/var/log/grafana cfg:default.paths.data=/usr/local/var/lib/grafana cfg:default.paths.plugins= [YOUR PLUGIN PATH]
```
