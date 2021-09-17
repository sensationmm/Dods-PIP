import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { AwsCognito } from "../../../services";

export interface DeleteUserParameters {
    email: string;
    password: string;
}

export const deleteUser = async ({ email, password }: DeleteUserParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError("Request Body should contain Email field.");
    } else if (!password) {
        throw new HttpBadRequestError("Request Body should contain Password field.");
    }

    let response: APIGatewayProxyResultV2;

    try {
        const result = await AwsCognito.defaultInstance.deleteUser(email, password);

        response = new HttpSuccessResponse(result);
    } catch (error: any) {
        response = new HttpUnauthorizedResponse(error);
    }

    return response;
};