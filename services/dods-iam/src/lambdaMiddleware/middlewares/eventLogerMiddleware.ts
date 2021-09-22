import { AsyncLambdaMiddleware } from "nut-pipe";

export const eventLogerMiddleware: AsyncLambdaMiddleware = async (event, context, callback, next) => {

    return await next(event, context, callback);
};
