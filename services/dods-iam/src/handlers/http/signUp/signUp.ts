import { HttpError, HttpResponse, HttpStatusCode } from "@dodsgroup/dods-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { SignUpParameters } from "../../../domain";
import { LoginRepository } from "../../../repositories";
import { AwsCognito } from "../../../services";

export const signUp: AsyncLambdaMiddleware<SignUpParameters> = async ({ email, password }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!password) {
        throw new HttpError("Request Body should contain Password field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        await AwsCognito.defaultInstance.signUp(email, password);

        await LoginRepository.defaultInstance.publishNewLogin({ userName: email, lastPassword: password });

        response = new HttpResponse(HttpStatusCode.OK, "SUCCESS");
    } catch (error: any) {
        const { code } = error;

        if (code === 'UsernameExistsException') {
            response = new HttpResponse(HttpStatusCode.NOT_FOUND, error);
        } else {
            response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
        }
    }
    return response;
};