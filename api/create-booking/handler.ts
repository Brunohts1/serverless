import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';
import { ResponseUtil } from '../utils/response-util';
import { DynamoDB } from 'aws-sdk';
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";


export const create = async (
    event: APIGatewayProxyEvent 
): Promise<APIGatewayProxyResult> => {
    if (!event.body) return ResponseUtil.createResponse(400, 'Invalid body.')
    const body = JSON.parse(event.body);

    if (!event.requestContext.authorizer) return ResponseUtil.createResponse(401, 'User not logged, please log in and try again');

    const client = new DynamoDBClient({ region:  process.env.AWS_REGION });

    const ddbDocClient = DynamoDBDocumentClient.from(client);

    await ddbDocClient.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_BOOKINGS || '',
          Item: {
            id: v4(),
            date: body.date.toString(),
            user: event.requestContext.authorizer.lambda
          },
        })
      );

    return ResponseUtil.createResponse(201, 'Success creating booking!')
}