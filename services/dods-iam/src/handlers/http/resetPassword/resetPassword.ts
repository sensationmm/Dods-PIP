import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { ResetPasswordParameters } from "../../../domain";
import { LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export const resetPassword: AsyncLambdaMiddleware<ResetPasswordParameters> = async ({ email, newPassword, verificationCode }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!newPassword) {
        throw new HttpError("Request Body should contain NewPassword field.", HttpStatusCode.BAD_REQUEST);
    } else if (!verificationCode) {
        throw new HttpError("Request Body should contain VerificationCode field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        const decodedEmail = Buffer.from(decodeURIComponent(email), 'base64').toString();

        const validateLastPassword = await LoginRepository.defaultInstance.validateLastPassword(decodedEmail, newPassword);

        if (validateLastPassword) {

            const result = await AwsCognito.defaultInstance.resetPassword(decodedEmail, newPassword, verificationCode);

            await LoginRepository.defaultInstance.publishUpdatePassword({ userName: decodedEmail, lastPassword: newPassword });

            response = new HttpResponse(HttpStatusCode.OK, result);
        }
        else {
            response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, 'This password is used previously');
        }
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};