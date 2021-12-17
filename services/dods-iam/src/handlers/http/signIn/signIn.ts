import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { config, SignInParameters } from "../../../domain";
import { UserProfileRepository, LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export const signIn: AsyncLambdaMiddleware<SignInParameters> = async ({ email, password }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!password) {
        throw new HttpError("Request Body should contain Password field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        const tokens = await AwsCognito.defaultInstance.signIn(email, password);

        await LoginRepository.defaultInstance.resetLoginAttempt(email);

        const { UserAttributes, Username } = await AwsCognito.defaultInstance.getUserData(tokens?.accessToken);

        if (UserAttributes) {
            const clientAccountId = UserAttributes.find((a) => a.Name === 'custom:ClientAccountId')?.Value;
            const clientAccountName = UserAttributes.find((a) => a.Name === 'custom:clientAccountName')?.Value;
            const userProfileUuid = UserAttributes.find((a) => a.Name === 'custom:UserProfileUuid')?.Value;

            const { role = '', firstName = '', lastName = '', isDodsUser = false } = (userProfileUuid && userProfileUuid !== '_' && await UserProfileRepository.defaultInstance.getUser({ userId: userProfileUuid })) || {};

            Object.assign(tokens, { clientAccountId, clientAccountName, dodsIAMUserId: Username, userId: userProfileUuid, userName: email, role, displayName: `${firstName} ${lastName}`, isDodsUser });
        }

        response = new HttpResponse(HttpStatusCode.OK, tokens);
    } catch (error: any) {

        const { code, name, message } = error;

        if (message !== 'User is disabled.' && code === 'NotAuthorizedException') {
            const failedLoginAttemptCount = await LoginRepository.defaultInstance.incrementFailedLoginAttempt(email);

            if (failedLoginAttemptCount >= config.aws.resources.cognito.failedLoginAttemptCount) {
                await AwsCognito.defaultInstance.disableUser(email)
                error.message = "User is disabled."
                error.UserDisabled = true;
            }

            error.failedLoginAttemptCount = failedLoginAttemptCount;
        }

        const isActive = !(message === 'User is disabled.');

        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, { name, code, message, isActive });
    }

    return response;
};