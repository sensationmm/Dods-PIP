import { APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpResponse, HttpStatusCode } from "../domain";
import { Logger } from '../utility';

const isApiGatewayResponse = (response: any): response is APIGatewayProxyStructuredResultV2 => response.statusCode !== undefined

export const errorMiddleware: AsyncLambdaMiddleware<APIGatewayProxyEvent> = async (event, context, callback, next) => {

    Logger.info('ErrorMiddleware Entry');

    let response: APIGatewayProxyStructuredResultV2 = undefined as any;
    let error: any;

    try {

        const result = await next!(event, context, callback);

        if (isApiGatewayResponse(result)) {
            response = result;
        } else {
            response = new HttpResponse(HttpStatusCode.OK, result);
        }

    } catch (err: any) {

        error = err;

    } finally {
        if (error) {
            const { stack = undefined, statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR, message, ...rest } = typeof error === 'string' ? { message: error } : error;

            response = new HttpResponse(statusCode, {
                success: false,
                message,
                error: rest,
            });

            Logger.error('ErrorMiddleware:', error);
        } else {
            Logger.info('ErrorMiddleware Success');
        }
    }

    return response;
};
