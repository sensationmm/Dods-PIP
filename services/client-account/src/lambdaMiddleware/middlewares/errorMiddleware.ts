import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpInternalServerErrorResponse } from "../../domain";

export const errorMiddleware: AsyncLambdaMiddleware = async (event, context, next) => {

    let result;
    try {

        result = await next(event, context);

    } catch (error: any) {
        if (typeof error === 'string') {
            return new HttpInternalServerErrorResponse(error);
        }

        let { stack, statusCode, message, ...rest } = error;
        result = new HttpInternalServerErrorResponse({ message, ...rest });
    }

    return result;
};
