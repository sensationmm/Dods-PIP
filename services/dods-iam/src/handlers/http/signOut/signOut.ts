import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpSuccessResponse } from '../../../domain';
import { AwsCognito } from "../../../services";

const badRequestError = "Request Body should contain Email field.";

export interface SignOutParameters {
    email: string;
}

export const signOut = async ({ email }: SignOutParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError(badRequestError);
    }

    await AwsCognito.defaultInstance.signOut(email);

    return new HttpSuccessResponse();
};