import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpError } from "../../domain";

export const errorMiddleware: AsyncLambdaMiddleware = async (event, context, callback, next) => {

    let result;
    try {

        result = await next(event as any, context, callback);

    } catch (error: any) {
        const { stack, statusCode = 500, message, ...rest } = error;
        result = new HttpError({ message, ...rest }, statusCode);
    }

    return result;
};
