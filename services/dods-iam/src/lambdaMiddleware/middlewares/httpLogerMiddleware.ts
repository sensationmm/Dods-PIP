import { AsyncLambdaMiddleware } from "nut-pipe";

export const httpLogerMiddleware: AsyncLambdaMiddleware = async (event, context, callback, next) => {

    return await next(event, context, callback);
};
