import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ResponseUtil } from "../utils/response-util";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb'

export const list = async (
    event: APIGatewayProxyEvent 
): Promise<APIGatewayProxyResult> => {
    console.log(event)
    console.log(event.requestContext.authorizer?.lambda.role)
    if (event.requestContext.authorizer?.lambda.role === 'ADMIN') {
        const client = new DynamoDBClient({ region:  process.env.AWS_REGION });
        const ddbDocClient = DynamoDBDocumentClient.from(client);
        
        const data = await ddbDocClient.send(
            new ScanCommand({
              TableName: process.env.DYNAMODB_BOOKINGS,
            })
        );

        const items = data.Items?.map( (item) => {
            return unmarshall(item);
        });
        
        return {
            statusCode: 200, 
            body: JSON.stringify(items)
        };

    }
    return ResponseUtil.createResponse(403, 'User not allowed to perform this action.');
}