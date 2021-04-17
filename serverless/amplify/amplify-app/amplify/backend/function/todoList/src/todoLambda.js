const aws = require("aws-sdk");

const lambda = new aws.Lambda({
    region: "us-west-2",
});

const invokeLambda = (lambda, params) =>
    new Promise((resolve, reject) => {
        lambda.invoke(params, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(data.Payload));
            }
        });
    });

const getTime = () => {
    const params = {
        FunctionName: 'timeService-dev',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({})
      }
    return invokeLambda(lambda, params);
}

module.exports = { getTime };