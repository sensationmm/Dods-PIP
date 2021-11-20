import { HttpError, HttpResponse, HttpStatusCode } from "@dodsgroup/dods-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { CreateUserParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const createUser: AsyncLambdaMiddleware<CreateUserParameters> = async ({ email, clientAccountId, clientAccountName }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        const result = await AwsCognito.defaultInstance.createUser(email, clientAccountId, clientAccountName);

        response = new HttpResponse(HttpStatusCode.OK, { success: true, data: { userName: result.User?.Username } });
    } catch (error: any) {
        const { code } = error;

        if (code === 'UsernameExistsException') {
            response = new HttpResponse(HttpStatusCode.NOT_FOUND, { success: false, error });
        } else {
            response = new HttpResponse(HttpStatusCode.UNAUTHORIZED, { success: false, error });
        }
    }
    return response;
};