import { APIGatewayProxyResultV2 } from "aws-lambda";
import { HttpBadRequestError, HttpNotFoundResponse, HttpSuccessResponse, HttpUnauthorizedResponse } from '../../../domain';
import { LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export interface SignUpParameters {
    email: string;
    password: string;
}

export const signUp = async ({ email, password }: SignUpParameters): Promise<APIGatewayProxyResultV2> => {

    if (!email) {
        throw new HttpBadRequestError("Request Body should contain Email field.");
    } else if (!password) {
        throw new HttpBadRequestError("Request Body should contain Password field.");
    }

    let response: APIGatewayProxyResultV2;

    try {
        await AwsCognito.defaultInstance.signUp(email, password);

        await LoginRepository.defaultInstance.publishNewLogin({ userName: email, lastPassword: password });

        response = new HttpSuccessResponse("SUCCESS");
    } catch (error: any) {
        const { code } = error;

        if (code === 'UsernameExistsException') {
            response = new HttpNotFoundResponse(error);
        } else {
            response = new HttpUnauthorizedResponse(error);
        }
    }
    return response;
};