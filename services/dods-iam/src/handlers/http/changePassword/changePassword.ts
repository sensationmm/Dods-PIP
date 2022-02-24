import { AsyncLambdaMiddleware, HttpError, HttpResponse, HttpStatusCode } from "@dodsgroup/dods-lambda";

import { AwsCognito } from "../../../services";
import { ChangePasswordParameters } from "../../../domain";
import { LoginRepository } from "../../../repositories";

export const changePassword: AsyncLambdaMiddleware<ChangePasswordParameters> = async ({ email, password, newPassword }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!password) {
        throw new HttpError("Request Body should contain Password field.", HttpStatusCode.BAD_REQUEST);
    } else if (!newPassword) {
        throw new HttpError("Request Body should contain NewPassword field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        await AwsCognito.defaultInstance.signIn(email, password);

        const validateLastPasswordWithNewPassword = await LoginRepository.defaultInstance.validateLastPassword(email, newPassword);

        if (validateLastPasswordWithNewPassword) {
            await AwsCognito.defaultInstance.changePassword(email, password, newPassword)

            await LoginRepository.defaultInstance.publishUpdatePassword({ userName: email, lastPassword: newPassword });

            response = new HttpResponse(HttpStatusCode.OK, {
                success: true
            });
        }
        else {
            response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, 'This password is used previously');
        }
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};