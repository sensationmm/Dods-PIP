import { HttpError, HttpStatusCode } from '../';

export class HttpNotFoundError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = HttpNotFoundError.name;
    }
}

export class HttpBadRequestError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.BAD_REQUEST);
        this.name = HttpBadRequestError.name;
    }
}

export class HttpUnauthorizedError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.UNAUTHORIZED);
        this.name = HttpUnauthorizedError.name;
    }
}

export class HttpForbiddenError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.FORBIDDEN);
        this.name = HttpForbiddenError.name;
    }
}

export class HttpInternalServerError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
        this.name = HttpInternalServerError.name;
    }
}
