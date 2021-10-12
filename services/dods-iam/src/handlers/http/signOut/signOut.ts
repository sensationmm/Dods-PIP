import { AsyncLambdaMiddleware, HttpStatusCode, HttpError, HttpResponse } from "@dodsgroup/dods-lambda";
import { SignOutParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const signOut: AsyncLambdaMiddleware<SignOutParameters> = async ({ email }) => {

    if (!email) {
        throw new HttpError("Request Body should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    await AwsCognito.defaultInstance.signOut(email);

    return new HttpResponse(HttpStatusCode.OK, 'SUCCESS');
};