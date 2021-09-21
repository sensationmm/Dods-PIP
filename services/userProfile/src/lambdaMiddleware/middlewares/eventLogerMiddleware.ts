import { AsyncLambdaMiddleware } from "nut-pipe";

export const eventLogerMiddleware: AsyncLambdaMiddleware = async (event, context, next) => {

    return  await next(event, context);
};
