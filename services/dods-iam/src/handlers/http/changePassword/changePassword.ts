import { AsyncLambdaMiddleware } from "@dodsgroup/dods-lambda";
import { HttpBadRequestError } from '../../../domain';
import { LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export interface ChangePasswordParameters {
    email: string;
    password: string;
    newPassword: string;
}

export const changePassword: AsyncLambdaMiddleware<ChangePasswordParameters> = async ({ email, password, newPassword }) => {

    if (!email) {
        throw new HttpBadRequestError("Request Body should contain Email field.");
    } else if (!password) {
        throw new HttpBadRequestError("Request Body should contain Password field.");
    } else if (!newPassword) {
        throw new HttpBadRequestError("Request Body should contain NewPassword field.");
    }

    let response: string;

    await AwsCognito.defaultInstance.signIn(email, password);

    const validateLastPasswordWithNewPassword = await LoginRepository.defaultInstance.validateLastPassword(email, newPassword);

    if (validateLastPasswordWithNewPassword) {
        const result = await AwsCognito.defaultInstance.changePassword(email, password, newPassword)

        await LoginRepository.defaultInstance.publishUpdatePassword({ userName: email, lastPassword: newPassword });

        response = result as string;
    }
    else {
        response = 'This password is used previously';
    }

    return response;
};