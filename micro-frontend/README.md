# micro frontend demo with ngnix
micro frontend with navigation and shared data

## app a
my-app tests react-router, data in localStorage to be shared, <a> to internal file, and <a> to external app b

`npm run build` then rename the `build` folder to be `appa`

## app b
my-app2 tests <a> to external app a

`npm run build` then rename the `build` folder to be `appb`

## ngnix setup
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