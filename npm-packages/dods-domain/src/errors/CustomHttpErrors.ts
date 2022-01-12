import { HttpStatusCode } from '../http';
import { HttpError } from './HttpError';

export class HttpNotFoundError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = HttpNotFoundError.name;
    }
}

export class HttpBadRequestError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.BAD_REQUEST);
        this.name = HttpBadRequestError.name;
    }
}

export class HttpUnauthorizedError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.UNAUTHORIZED);
        this.name = HttpUnauthorizedError.name;
    }
}

export class HttpForbiddenError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.FORBIDDEN);
        this.name = HttpForbiddenError.name;
    }
}

export class HttpInternalServerError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
        this.name = HttpInternalServerError.name;
    }
}

export class UserProfileError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = UserProfileError.name;
    }
}

export class ClientAccountError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = ClientAccountError.name;
    }
}

export class CollectionError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = CollectionError.name;
    }
}

export class CollectionAlertError extends HttpError {
    constructor(message: string | unknown, public error?: Error) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = CollectionAlertError.name;
    }
}