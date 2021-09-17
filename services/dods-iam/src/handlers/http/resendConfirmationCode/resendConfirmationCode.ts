import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { AwsCognito } from "../../../services";

const badRequestError = "Request Body should contain Email field.";

export interface ResendConfirmationCodeParameters {
    email: string;
}

export const resendConfirmationCode = async ({ email }: ResendConfirmationCodeParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError(badRequestError);
    }

    let response: APIGatewayProxyResultV2;

    try {
        await AwsCognito.defaultInstance.resendConfirmationCode(email);

        response = new HttpSuccessResponse("SUCCESS");
    } catch (error: any) {
        response = new HttpUnauthorizedResponse(error);
    }

    return response;
};