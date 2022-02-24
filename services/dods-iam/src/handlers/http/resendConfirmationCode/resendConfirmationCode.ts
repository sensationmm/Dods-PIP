import { AsyncLambdaMiddleware, HttpError, HttpResponse, HttpStatusCode } from "@dodsgroup/dods-lambda";

import { AwsCognito } from "../../../services";
import { ResendConfirmationCodeParameters } from "../../../domain";

export const resendConfirmationCode: AsyncLambdaMiddleware<ResendConfirmationCodeParameters> = async ({ email }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        await AwsCognito.defaultInstance.resendConfirmationCode(email);

        response = new HttpResponse(HttpStatusCode.OK, {
            success: true
        });
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};