import { HttpStatusCode } from '.';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export class HttpResponse implements APIGatewayProxyStructuredResultV2 {
    body?: string;

    constructor(public statusCode: HttpStatusCode, input?: string | unknown) {
        this.body = typeof input === 'string' ? input : JSON.stringify(input);
    }
}
