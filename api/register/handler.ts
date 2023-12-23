import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hashSync } from 'bcryptjs';
import { v4 } from 'uuid';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { IUserRequest, IUserResponse } from "../interfaces/user-interface";


export const register = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) return {
    statusCode: 400,
    body: JSON.stringify({message: 'Invalid body'}),
  }

  const body: IUserRequest = JSON.parse(event.body);
  const client = new DynamoDBClient({ region:  process.env.AWS_REGION });
  const putItemCommand = new PutItemCommand({
    TableName: process.env.DYNAMODB_USERS || '',
    Item: {
      id: { S: v4() },
      name: { S: body.name },
      email: { S: body.email },
      password: { S: hashSync(body.password, 10) },
    }
  })


  await client.send(putItemCommand);

  const userResponse: IUserResponse = {
    email: body.email,
    name: body.name
  }
  return {
    statusCode: 200,
    body: JSON.stringify({'Success' : userResponse})
  }
}