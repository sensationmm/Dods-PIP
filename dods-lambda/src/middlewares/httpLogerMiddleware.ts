import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpResponse, HttpStatusCode } from "../domain";
import { Logger } from "../utility";

export const httpLogerMiddleware: AsyncLambdaMiddleware = async (event, context, _, next) => {

    Logger.info(`HttpLogerMiddleware Entry`, { path: event.requestContext.http.path, method: event.requestContext.http.method });

    const result = await next(event, context);

    const response = new HttpResponse(HttpStatusCode.OK, result);

    Logger.info(`HttpLogerMiddleware Success`, { ...response });

    return response;
};
