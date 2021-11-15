import { HttpError, HttpStatusCode } from "@dodsgroup/dods-lambda";

export class UserProfileError extends HttpError {
    constructor(message: string | unknown) {
        super(message, HttpStatusCode.NOT_FOUND);
        this.name = UserProfileError.name;
    }
}