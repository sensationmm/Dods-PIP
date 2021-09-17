import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { AwsCognito } from "../../../services";

const badRequestError = "Request Body should contain Email field.";

export interface ForgotPasswordParameters {
    email: string;
}

export const forgotPassword = async ({ email }: ForgotPasswordParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError(badRequestError);
    }

    let response: APIGatewayProxyResultV2;

    try {
        await AwsCognito.defaultInstance.forgotPassword(email);

        response = new HttpSuccessResponse("SUCCESS");
    } catch (error: any) {
        response = new HttpUnauthorizedResponse(error);
    }

    return response;
};
