# AWS Amplify serverless sandbox

## Frontend react.js app
1. Invoke API gateway + Lambda
2. Invoke GraphQL

## Backend
1. Function
express.js server as Lambda function to 
+ server REST API requests, /todo/version
* invoke GraphQL api from the lambda, /todo

2. APIs
+ apiTodoList to connect Lambda
+ apiTodoListGrpah to connect GraphQL + DynmoDB

3. AWS secret is saved and auto managed by the `aws-export.js` file; it is not pushed in github
