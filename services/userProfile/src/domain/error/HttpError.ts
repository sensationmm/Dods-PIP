import { HttpStatusCode } from "../";

export class HttpError extends Error {
    constructor(message: string | unknown, public statusCode: HttpStatusCode) {
        super(typeof message === 'string' ? message : JSON.stringify(message));
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = HttpError.name;
    }
}