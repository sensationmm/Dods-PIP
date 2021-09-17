import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpNotFoundResponse, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { AwsCognito } from "../../../services";

export interface ConfirmRegistrationParameters {
    email: string;
    verificationCode: string;
}

export const confirmRegistration = async ({ email, verificationCode }: ConfirmRegistrationParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError("Request Body should contain Email field.");
    } else if (!verificationCode) {
        throw new HttpBadRequestError("Request Body should contain VerificationCode field.");
    }

    let response: APIGatewayProxyResultV2;

    try {
        const result = await AwsCognito.defaultInstance.confirmRegistration(email, verificationCode);

        response = new HttpSuccessResponse(result);
    } catch (error: any) {
        const { code } = error;

        if (code === 'ExpiredCodeException') {
            response = new HttpUnauthorizedResponse(error);
        } else {
            response = new HttpNotFoundResponse(error);
        }
    }
    return response;
};