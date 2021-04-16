/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


const postTodo = require('./todoGraph');
const aws = require('aws-sdk');

const lambda = new aws.Lambda({
  region: 'us-west-2'
});

const invokeLambda = (lambda, params) => new Promise((resolve, reject) => {
  lambda.invoke(params, (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(JSON.parse(data.Payload));
    }
  });
});

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/todo/version', async (req, res) => {
  const params = {
    FunctionName: 'timeService-dev',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({})
  }
  const resp = await invokeLambda(lambda, params);
  res.json({version: '1.0.1', time: resp.body});
});

app.post('/todo/', async (req, res) => {
  await postTodo(req.body.name, req.body.description);
  res.json({success: 'pong', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
