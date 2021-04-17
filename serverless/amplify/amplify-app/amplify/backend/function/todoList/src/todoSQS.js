const aws = require("aws-sdk");
const aws_export = require('./aws-exports');

const sqs = new aws.SQS({
    region: "us-west-2",
});

const invokeSqsSendMessage = (sqs, params) =>
    new Promise((resolve, reject) => {
        sqs.sendMessage(params, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });

const sendMessage = (noteId) => {
    const params = {
        MessageBody: `print note with id ${noteId}`,
        QueueUrl: aws_export.aws_sqs_url,
    };
    return invokeSqsSendMessage(sqs, params);
};

module.exports = { sendMessage };