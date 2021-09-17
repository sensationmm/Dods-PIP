import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export interface ResetPasswordParameters {
    email: string;
    newPassword: string;
    verificationCode: string;
}

export const resetPassword = async ({ email, newPassword, verificationCode }: ResetPasswordParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError("Request Body should contain Email field.");
    } else if (!newPassword) {
        throw new HttpBadRequestError("Request Body should contain NewPassword field.");
    } else if (!verificationCode) {
        throw new HttpBadRequestError("Request Body should contain VerificationCode field.");
    }

    let response: APIGatewayProxyResultV2;

    try {
        const decodedEmail = Buffer.from(decodeURIComponent(email), 'base64').toString();

        const validateLastPassword = await LoginRepository.defaultInstance.validateLastPassword(decodedEmail, newPassword);

        if (validateLastPassword) {

            const result = await AwsCognito.defaultInstance.resetPassword(decodedEmail, newPassword, verificationCode);

            await LoginRepository.defaultInstance.publishUpdatePassword({ userName: decodedEmail, lastPassword: newPassword });

            response = new HttpSuccessResponse(result);
        }
        else {
            response = new HttpSuccessResponse('This password is used previously');
        }
    } catch (error: any) {
        response = new HttpUnauthorizedResponse(error);
    }

    return response;
};