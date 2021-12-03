import HttpStatusCode from './HttpStatusCode';

export interface HttpResponse {
    statusCode?: HttpStatusCode;
    headers?: {
        [header: string]: boolean | number | string;
    };
    body?: string;
    cookies?: string[];
}

export class HttpDefaultResponse<T> implements HttpResponse {
    body?: string;

    constructor(public statusCode: HttpStatusCode, input?: T) {
        this.body = typeof input === 'string' ? input : JSON.stringify(input);
    }
}

export class HttpSuccessResponse<T> extends HttpDefaultResponse<T> {
    constructor(input?: T) {
        super(HttpStatusCode.OK, input);
    }
}

export class HttpUnauthorizedResponse<T> extends HttpDefaultResponse<T> {
    constructor(input?: T) {
        super(HttpStatusCode.UNAUTHORIZED, input);
    }
}

export class HttpNotFoundResponse<T> extends HttpDefaultResponse<T> {
    constructor(input?: T) {
        super(HttpStatusCode.NOT_FOUND, input);
    }
}