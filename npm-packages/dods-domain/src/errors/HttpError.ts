import { HttpStatusCode } from '../http';

export class HttpError extends Error {
    constructor(message: string | unknown, public statusCode: HttpStatusCode, public error?: Error) {
        super(typeof message === 'string' ? message : JSON.stringify(message));
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = HttpError.name;
    }
}