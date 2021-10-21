import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { ResendConfirmationCodeParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const resendConfirmationCode: AsyncLambdaMiddleware<ResendConfirmationCodeParameters> = async ({ email }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        await AwsCognito.defaultInstance.resendConfirmationCode(email);

        response = new HttpResponse(HttpStatusCode.OK, "SUCCESS");
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};