# AWS Amplify serverless sandbox

## Frontend react.js app
1. Invoke API gateway + Lambda
2. Invoke GraphQL

## Backend
1. Function

* Serverless express function (Integration with Amazon API Gateway) - `/todo/version`
* Call internal lambda service - `timeService`
* Invoke GraphQL api from the lambda - `todo`
* Invoke SQS send message - `todo/print/:noteId`
* SQS to trigger an internal utility lamda service - `printService`
* TODO - Use layers to share common code between functions
* Secruity
    * IAM role - lambda function has [execution role](./images/lambda-execution-role.png)
    * IAM policies - Execution role has [policies](./images/lambda-execution-role+policies.png) to enable such as, call another lambda, send message to SQS
    * Add a [role](./images/sqs-role.png) to SQS to allow a lambda send message to the queue

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
1. aws-exports.js - contains all the aws secrets are not included. [Example](./images/aws-exports.png)
