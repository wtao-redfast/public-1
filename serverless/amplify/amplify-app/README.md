# AWS Amplify serverless sandbox

## Frontend react.js app
1. Invoke API gateway + Lambda
2. Invoke GraphQL

## Backend
1. Function

* Serverless express function (Integration with Amazon API Gateway) - `/todo/version`
* Call internal lambda function with [IAM role](./images/lambda-execution-role.png) + [IAM policies](./images/lambda2lambda-role-policies.png) - `timeService` 
* Invoke GraphQL api from the lambda - `todo`
* TODO - Use layers to share common code between functions

2. APIs
+ `apiTodoList` to connect Lambda
+ `apiTodoListGrpah` to connect GraphQL + DynmoDB

3. AWS secret is saved and auto managed by the `aws-export.js` file; it is not pushed in github

## AWS services used
1. Amplify - as the top level umbrella service
2. API Gateway + Lambda - for RESTful interface
3. AppSync - for GraphQL interface
4. DynamoDB - NoSQL provider
5. CloudWatch - service observability
6. Simople Queue Service - application message queue
7. TODO - AWS Cognito for authn and authz
8. TODO - AWS S3 & CloundFront
9. TODO - API Analytics
10. TODO - CI/CD with Github


## Notes
1. aws-exports.js - contains all the aws secrets are not included
