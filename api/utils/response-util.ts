import { APIGatewayProxyResult } from "aws-lambda";

export class ResponseUtil {
    public static createResponse(status: number, message: string): APIGatewayProxyResult {
        return {
            statusCode: status,
            body: JSON.stringify({message: message})
        }
    }
}