import { verify } from 'jsonwebtoken';
import { ResponseUtil } from '../utils/response-util';
import { APIGatewayRequestAuthorizerEventV2, AuthResponse, PolicyDocument } from 'aws-lambda';

export async function authorizer(event: APIGatewayRequestAuthorizerEventV2) {
    const token = event.headers?.authorization;
    const secret = process.env.JWT_SECRET;
    if (!secret || !token) return ResponseUtil.createResponse(400, 'Invalid token, please log in and try again.');
    try {
        const user = verify(token, secret);
        return (generatePolicy('Allow', event.routeArn, user as string));
    } catch (e) {
        console.log(e);
        return (generatePolicy('Deny', event.routeArn));
    }
};

function generatePolicy (effect: string, resource: string, user?: any): AuthResponse {
    const authResponse = {} as AuthResponse;
    const policyDocument = {} as PolicyDocument
    if (effect && resource) {
      policyDocument.Version = '2012-10-17'
      policyDocument.Statement = []
      const statementOne: any = {}
      statementOne.Action = 'execute-api:Invoke'
      statementOne.Effect = effect
      statementOne.Resource = resource
      policyDocument.Statement[0] = statementOne
    }

    if (user) {
        authResponse.policyDocument = policyDocument;
    }

    return {
        principalId: 'user',
        policyDocument: policyDocument,
        context: user
      } as AuthResponse
  }
