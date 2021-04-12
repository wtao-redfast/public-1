import * as awsServerlessExpress from 'aws-serverless-express';
import app from './app.js';

const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};