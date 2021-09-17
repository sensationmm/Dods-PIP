import { APIGatewayProxyResultV2 } from "aws-lambda";
import { config, HttpBadRequestError, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export interface SignInParameters {
    email: string;
    password: string;
}

export const signIn = async ({ email, password }: SignInParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError("Request Body should contain Email field.");
    } else if (!password) {
        throw new HttpBadRequestError("Request Body should contain Password field.");
    }

    let response: APIGatewayProxyResultV2;

    try {
        const tokens = await AwsCognito.defaultInstance.signIn(email, password);

        await LoginRepository.defaultInstance.resetLoginAttempt(email);

        response = new HttpSuccessResponse(tokens);
    } catch (error: any) {
        const failedLoginAttemptCount = await LoginRepository.defaultInstance.incrementFailedLoginAttempt(email);

        if (failedLoginAttemptCount >= config.aws.resources.cognito.failedLoginAttemptCount) {
            await AwsCognito.defaultInstance.disableUser(email)
            error.message = "User is disabled."
            error.UserDisabled = true;
        }

        error.failedLoginAttemptCount = failedLoginAttemptCount;

        response = new HttpUnauthorizedResponse(error);
    }

    return response;
};