import { APIGatewayProxyEvent } from "aws-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { Logger } from "../utility";

export const httpLogerMiddleware: AsyncLambdaMiddleware<APIGatewayProxyEvent> = async (event, context, callback, next) => {

    Logger.info(`HttpLogerMiddleware Entry`, { path: event.path, method: event.httpMethod });

    const result = await next!(event, context, callback);

    Logger.info(`HttpLogerMiddleware Success`);

    return result;
};
