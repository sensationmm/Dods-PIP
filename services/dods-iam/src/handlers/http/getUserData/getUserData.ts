import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpNotFoundResponse, HttpSuccessResponse } from '../../../domain';
import { AwsCognito } from "../../../services";

export interface GetUserDataParameters {
    accessToken: string;
}

export const getUserData = async ({ accessToken }: GetUserDataParameters): Promise<APIGatewayProxyResultV2> => {

    if (!accessToken) {
        throw new HttpBadRequestError("Request QueryString should contain Email field.");
    }

    let response: APIGatewayProxyResultV2;

    try {
        const result = await AwsCognito.defaultInstance.getUserData(accessToken);

        response = new HttpSuccessResponse(result);
    } catch (error: any) {
        // const { code } = error;

        response = new HttpNotFoundResponse(error);
    }
    return response;
};