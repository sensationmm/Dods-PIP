import { HttpStatusCode } from './';

export interface HttpResponse {
    statusCode?: HttpStatusCode;
    headers?: {
        [header: string]: boolean | number | string;
    };
    body?: string;
    cookies?: string[];
}

export abstract class BaseHttpResponse<T> implements HttpResponse {
    body?: string;

    constructor(public statusCode: HttpStatusCode, input?: T) {
        this.body = typeof input === 'string' ? input : JSON.stringify(input);
    }
}

export class HttpSuccessResponse<T> extends BaseHttpResponse<T> {
    constructor(input?: T) {
        super(HttpStatusCode.OK, input);
    }
}

export class HttpUnauthorizedResponse<T> extends BaseHttpResponse<T> {
    constructor(input?: T) {
        super(HttpStatusCode.UNAUTHORIZED, input);
    }
}

export class HttpNotFoundResponse<T> extends BaseHttpResponse<T> {
    constructor(input?: T) {
        super(HttpStatusCode.NOT_FOUND, input);
    }
}

export class HttpInternalServerErrorResponse<T> extends BaseHttpResponse<T> {
    constructor(input?: T) {
        super(HttpStatusCode.INTERNAL_SERVER_ERROR, input);
    }
}