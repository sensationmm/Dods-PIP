import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { ForgotPasswordParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const forgotPassword: AsyncLambdaMiddleware<ForgotPasswordParameters> = async ({ email }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        await AwsCognito.defaultInstance.forgotPassword(email);

        response = new HttpResponse(HttpStatusCode.OK, {
            success: true
        });
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, {
            success: false, 
            error: error
        });
    }

    return response;
};
