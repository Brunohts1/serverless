const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION
});
const documentClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4, v4 } = require('uuid');

module.exports.create = async event => {
    const body = JSON.parse(event.body);

    await documentClient.put({
        TableName: process.env.DYNAMODB_BOOKINGS,
        Item: {
            id: v4(),
            date: body.date,
            user: event.requestContext.authorizer.lambda
        },
    }).promise();
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Agendamento realizado com sucesso!'}),
    }
}