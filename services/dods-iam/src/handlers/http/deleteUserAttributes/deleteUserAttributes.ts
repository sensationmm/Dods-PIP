import { HttpError, HttpResponse, HttpStatusCode } from "@dodsgroup/dods-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { DeleteUserAttributesParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const deleteUserAttributes: AsyncLambdaMiddleware<DeleteUserAttributesParameters> = async ({ email, attributeNames }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    } else if (!attributeNames) {
        throw new HttpError("Request Body should contain AttributeNames field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse;

    try {
        const result = await AwsCognito.defaultInstance.deleteUserAttributes(email, attributeNames);

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