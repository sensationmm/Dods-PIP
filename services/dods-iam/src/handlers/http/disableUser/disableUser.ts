import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { DisableUserParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const disableUser: AsyncLambdaMiddleware<DisableUserParameters> = async ({ email }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse<string>;

    try {
        const result = await AwsCognito.defaultInstance.disableUser(email);

        response = new HttpResponse(HttpStatusCode.OK, result);
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};