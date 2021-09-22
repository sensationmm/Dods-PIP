import { APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpResponse, HttpStatusCode } from "../domain";

export const errorMiddleware: AsyncLambdaMiddleware<APIGatewayProxyEvent> = async (event, context, callback, next) => {

    let response: APIGatewayProxyStructuredResultV2;

    console.log(event);

    try {

        const result = await next(event, context, callback);

        response = new HttpResponse(HttpStatusCode.OK, result);
    } catch (error: any) {
        const { stack, statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR, message, ...rest } = error;
        response = new HttpResponse(statusCode, { message, ...rest });
    }

    return response;
};
