import { HttpError, HttpResponse, HttpStatusCode } from "@dodsgroup/dods-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { UpdateUserAttributesParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const updateUserAttributes: AsyncLambdaMiddleware<UpdateUserAttributesParameters> = async ({ email, userAttributes }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        const result = await AwsCognito.defaultInstance.updateUserAttributes(email, userAttributes);

        response = new HttpResponse(HttpStatusCode.OK, { success: true, data: result });
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