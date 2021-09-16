import { AsyncLambdaMiddleware } from "nut-pipe";

export const httpLogerMiddleware: AsyncLambdaMiddleware = async (event, context, next) => {

    return  await next(event, context);
};
