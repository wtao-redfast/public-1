# micro frontend demo with nginx
micro frontend with navigation and shared data

## app a
my-app tests react-router, data in localStorage to be shared, <a> to internal file, and <a> to external app b

`homepage` field of packack.json is set to `appa`
    
`npm run build` then rename the `build` folder to be `appa`

## app b
my-app2 tests <a> to external app a

`homepage` field of packack.json is set to `appb`

`npm run build` then rename the `build` folder to be `appb`

## nginx setup
edit nginx conf `nano /usr/local/etc/nginx/nginx.conf`
    
1. set up locations

```java
    location /appa {
        root   /Users/wenweitao/Downloads/tmp/my-app/;
        try_files $uri $uri/ /appa/index.html;
    }

    location /appb {
        root   /Users/wenweitao/Downloads/tmp/my-app2/;
    }
```

2. use `try_files` to mitigate react-router issue
    
3. restart nginx `brew service restart nginx`
