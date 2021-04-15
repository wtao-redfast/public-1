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

## AWS services used
1. AWS Amplify - as the top level umbrella service
2. API Gateway + Lambda - for RESTful interface
3. AWS AppSync - for GraphQL interface
4. DynamoDB - NoSQL provider
5. CloudWatch - service observability
6. TODO - AWS S3
7. TODO - AWS Cognito for authn and authz
8. TODO - API Analytics
