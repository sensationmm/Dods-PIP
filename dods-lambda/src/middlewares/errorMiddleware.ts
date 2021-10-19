import { APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpResponse, HttpStatusCode } from "../domain";
import { Logger } from '../utility';

export const errorMiddleware: AsyncLambdaMiddleware<APIGatewayProxyEvent> = async (event, context, callback, next) => {

    let response: APIGatewayProxyStructuredResultV2;

    try {

        const result = await next!(event, context, callback);

        const apiGatewayResult = result as APIGatewayProxyStructuredResultV2;

        if (apiGatewayResult && apiGatewayResult.statusCode) {
            response = apiGatewayResult;
        } else {
            response = new HttpResponse(HttpStatusCode.OK, result);
        }

    } catch (error: any) {
        const { stack = undefined, statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR, message, ...rest } = typeof error === 'string' ? { message: error } : error;

        response = new HttpResponse(statusCode, {
            success: false,
            message,
            error: rest,
        });

        Logger.error('ErrorMiddleware:', error);

        throw error;
    }

    return response;
};
