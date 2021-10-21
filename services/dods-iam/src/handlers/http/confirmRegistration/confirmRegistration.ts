import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { ConfirmRegistrationParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const confirmRegistration: AsyncLambdaMiddleware<ConfirmRegistrationParameters> = async ({ email, verificationCode }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!verificationCode) {
        throw new HttpError("Request Body should contain VerificationCode field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        const result = await AwsCognito.defaultInstance.confirmRegistration(email, verificationCode);

        response = new HttpResponse(HttpStatusCode.OK, result);
    } catch (error: any) {
        const { code } = error;

        if (code === 'ExpiredCodeException') {
            response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
        } else {
            response = new HttpResponse(HttpStatusCode.NOT_FOUND, error);
        }
    }

    return response;
};