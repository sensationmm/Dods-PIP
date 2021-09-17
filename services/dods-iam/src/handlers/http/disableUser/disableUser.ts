import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { AwsCognito } from "../../../services";

const badRequestError = "Request Body should contain Email field.";

export interface DisableUserParameters {
    email: string;
    password: string;
}

export const disableUser = async ({ email }: DisableUserParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError(badRequestError);
    }

    let response: APIGatewayProxyResultV2;

    try {
        const result = await AwsCognito.defaultInstance.disableUser(email);

        response = new HttpSuccessResponse(result);
    } catch (error: any) {
        response = new HttpUnauthorizedResponse(error);
    }

    return response;
};