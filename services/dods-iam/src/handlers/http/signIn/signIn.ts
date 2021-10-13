import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { SigningParameters } from "aws-sdk/clients/signer";
import { config } from "../../../domain";
import { LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export const signIn: AsyncLambdaMiddleware<SigningParameters> = async ({ email, password }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!password) {
        throw new HttpError("Request Body should contain Password field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse<string>;

    try {
        const tokens = await AwsCognito.defaultInstance.signIn(email, password);

        await LoginRepository.defaultInstance.resetLoginAttempt(email);

        response = new HttpResponse(HttpStatusCode.OK, tokens);
    } catch (error: any) {
        const failedLoginAttemptCount = await LoginRepository.defaultInstance.incrementFailedLoginAttempt(email);

        if (failedLoginAttemptCount >= config.aws.resources.cognito.failedLoginAttemptCount) {
            await AwsCognito.defaultInstance.disableUser(email)
            error.message = "User is disabled."
            error.UserDisabled = true;
        }

        error.failedLoginAttemptCount = failedLoginAttemptCount;

        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};