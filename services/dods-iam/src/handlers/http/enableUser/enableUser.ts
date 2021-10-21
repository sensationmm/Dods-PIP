import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { EnableUserParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const enableUser: AsyncLambdaMiddleware<EnableUserParameters> = async ({ email }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        const result = await AwsCognito.defaultInstance.enableUUser(email);

        response = new HttpResponse(HttpStatusCode.OK, result);
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};