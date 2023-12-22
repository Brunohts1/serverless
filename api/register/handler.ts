import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hashSync } from 'bcryptjs';
import { v4 } from 'uuid';
import { config, DynamoDB } from 'aws-sdk';
config.update({
  region: process.env.AWS_REGION
});

interface User {
  name: string,
  email: string,
  password: string,
}
export const register = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) return {
    statusCode: 400,
    body: JSON.stringify({message: 'Invalid body'}),
  }
  const body: User = JSON.parse(event.body);
  const documentClient = new DynamoDB.DocumentClient();

  await documentClient.put({
    TableName: process.env.DYNAMODB_USERS || '',
    Item: {
      id: v4(),
      name: body.name,
      email: body.email,
      password: hashSync(body.password, 10),
    }
  });
  return {
    statusCode: 200,
    body: JSON.stringify({'Success' : body})
  }
}