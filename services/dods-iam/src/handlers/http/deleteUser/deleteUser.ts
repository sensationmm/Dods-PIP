import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { DeleteUserParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const deleteUser: AsyncLambdaMiddleware<DeleteUserParameters> = async ({ email, password }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!password) {
        throw new HttpError("Request Body should contain Password field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse<string>;

    try {
        const result = await AwsCognito.defaultInstance.deleteUser(email, password);

        response = new HttpResponse(HttpStatusCode.OK, result);
    } catch (error: any) {
        response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, error);
    }

    return response;
};