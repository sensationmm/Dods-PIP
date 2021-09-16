import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpError } from "../../domain";

export const errorMiddleware: AsyncLambdaMiddleware = async (event, context, next) => {

    let result;
    try {

        result = await next(event, context);

    } catch (error: any) {
        const { stack, statusCode = 500, message, ...rest } = error;
        result = new HttpError({ message, ...rest }, statusCode);
    }

    return result;
};
