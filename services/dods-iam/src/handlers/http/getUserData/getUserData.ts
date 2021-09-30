import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse, HttpError } from "@dodsgroup/dods-lambda";
import { GetUserDataParameters } from "../../../domain";
import { AwsCognito } from "../../../services";

export const getUserData: AsyncLambdaMiddleware<GetUserDataParameters> = async ({ accessToken }) => {

    if (!accessToken) {
        throw new HttpError("Request QueryString should contain Email field.", HttpStatusCode.BAD_REQUEST);
    }

    let response: HttpResponse<string>;

    try {
        const result = await AwsCognito.defaultInstance.getUserData(accessToken);

        response = new HttpResponse(HttpStatusCode.OK, result);
    } catch (error: any) {
        // const { code } = error;

        response = new HttpResponse(HttpStatusCode.NOT_FOUND, error);
    }
    return response;
};