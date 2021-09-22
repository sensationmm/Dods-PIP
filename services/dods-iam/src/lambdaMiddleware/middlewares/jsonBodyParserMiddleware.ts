import { AsyncLambdaMiddlewareWithServices } from "nut-pipe";
import { awsOpenApiRequestAdapter } from "../validation";

export const jsonBodyParserMiddleware: AsyncLambdaMiddlewareWithServices = async (event, context, _, services, next) => {

    const { genericOpenApiValidator } = services;

    let data;
    let openApiRequest;

    if (genericOpenApiValidator) {
        const openApiRequestData = await awsOpenApiRequestAdapter(event as any);
        openApiRequest = await genericOpenApiValidator.validateRequest(openApiRequestData);
        data = { ...openApiRequestData.body, ...openApiRequestData.rawHeaders, ...openApiRequestData.params, ...openApiRequestData.query }
    } else {
        data = { ...event.queryStringParameters, ...event.headers, ...event.pathParameters };

        if (event.body) {
            let parsedBody: any;
            try {
                parsedBody = JSON.parse(event.body);
            } catch {
                return new Error('invalid body, expected JSON');
            }

            Object.assign(data, parsedBody);
        }
    }

    const response = await next(data as any, context);

    if (genericOpenApiValidator && openApiRequest) {
        await genericOpenApiValidator.validateResponse(openApiRequest, response);
    }

    return response;
};