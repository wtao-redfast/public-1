# AWS Amplify serverless sandbox

## Frontend react.js app
1. Invoke API gateway + Lambda
2. Invoke GraphQL
3. Support user authentication - `login.js`

## Backend
1. Function

* Serverless express function (Integration with Amazon API Gateway) - `todoList`
    * API gateway -> Lambda `/todo/version` -> Internal Lambda `timeService`
    * API gateway -> Lambda `/todo` -> AWS AppSync + GraphQL + DynamoDB - `apiTodoListGraph`
    * API gateway -> Lambda `/todo/print/:noteId` -> AWS SQS ->  Internal Lambda `printService`
* Internal Lambda `timeService`
* Internal Lambda `printService`
* TODO - Use layers to share common code between functions
* Secruity
    * IAM role - lambda function has [execution role](./images/lambda-execution-role.png)
    * IAM policies - Execution role has [policies](./images/lambda-execution-role+policies.png) to enable such as, call another lambda, send message to SQS
    * Add a [role](./images/sqs-role.png) to SQS Access policy to allow a lambda send message to the queue

2. APIs
+ `apiTodoList` to RESTful API gateway to `todoList`
+ `apiTodoListGraph` to connect `AppSync + GraphQL + DynamoDB`

3. AWS secret is saved and auto managed by the `aws-export.js` file; it is not pushed in github. [Example](./images/aws-exports.png)

## AWS services used
1. Amplify - as the top level umbrella service
2. API Gateway + Lambda - for RESTful interface
3. AppSync - for GraphQL interface
4. DynamoDB - NoSQL provider
5. CloudWatch - service observability
6. Simople Queue Service - application message queue
7. AWS Cognito for authn and authz
8. TODO - AWS S3 & CloundFront
9. TODO - API Analytics
10. TODO - CI/CD with Github

