import { HttpStatusCode } from '../http';
import { HttpError } from './HttpError';

export class UserProfileError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = UserProfileError.name;
    }
}

export class ClientAccountError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = ClientAccountError.name;
    }
}

export class CollectionError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = CollectionError.name;
    }
}