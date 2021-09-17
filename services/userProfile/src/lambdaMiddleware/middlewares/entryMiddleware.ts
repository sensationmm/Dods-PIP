//@ts-ignore
export const entryMiddleware = async (event, context, callback, next) => {

    const result = await next(event, context);

    return result;
};
