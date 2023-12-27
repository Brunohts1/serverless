import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { compareSync } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { ResponseUtil } from '../utils/response-util';
import { unmarshall } from '@aws-sdk/util-dynamodb'

export const login = async( 
  event: APIGatewayProxyEvent 
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: 'Invalid body'}),
    }
  }
  const body = JSON.parse(event.body);

  const client = new DynamoDBClient({ region:  process.env.AWS_REGION });

  const queryCommand = new QueryCommand({
    TableName: process.env.DYNAMODB_USERS || '',
    IndexName: process.env.EMAIL_GSI || '',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': { S: body.email}
    },
  });
  
  const data = await client.send(queryCommand);
  
  if (!data.Items) return ResponseUtil.createResponse(404, 'Usuário e senha não combinam');
  
  const user = unmarshall(data.Items[0]);

  if (compareSync(body.password, user.password || '')){
    delete user.password;
    return ResponseUtil.createResponse(200, sign(user, process.env.JWT_SECRET!));
  }

  return ResponseUtil.createResponse(404, 'Usuário e senha não combinam');
}