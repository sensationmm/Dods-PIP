import { AsyncLambdaMiddleware } from "@dodsgroup/dods-lambda";

export const httpLogerMiddleware: AsyncLambdaMiddleware = async (event, context, callback, next) => {

    return await next(event, context, callback);
};
