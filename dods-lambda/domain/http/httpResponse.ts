import { HttpStatusCode } from './';
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export class HttpResponse<T> implements APIGatewayProxyStructuredResultV2 {
    body?: string | undefined;

    constructor(public statusCode: HttpStatusCode, input?: string | T) {
        this.body = typeof input === 'string' ? input : JSON.stringify(input);
    }
}
