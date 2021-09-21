import { AsyncLambdaMiddlewareWithServices } from "nut-pipe";
import { awsOpenApiRequestAdapter } from "../validation";

export const openApiValidatorMiddleware: AsyncLambdaMiddlewareWithServices = async (event, context, _, services, next) => {

    const { genericOpenApiValidator } = services;

    let data;
    let openApiRequest;
    let body;

    if (genericOpenApiValidator) {
        const openApiRequestData = await awsOpenApiRequestAdapter(event as any);
        openApiRequest = await genericOpenApiValidator.validateRequest(openApiRequestData);
        data = { ...openApiRequestData.rawHeaders, ...openApiRequestData.params, ...openApiRequestData.query };
        body = openApiRequestData.body;
    } else {
        data = { ...event.queryStringParameters, ...event.headers, ...event.pathParameters };

        body = event.body;
    }

    if (body) {
        let parsedBody: any;
        try {
            parsedBody = JSON.parse(body);
        } catch {
            return new Error('invalid body, expected JSON');
        }

        Object.assign(data, parsedBody);
    }

    const response = await next(data as any, context);

    if (genericOpenApiValidator && openApiRequest) {
        await genericOpenApiValidator.validateResponse(openApiRequest, response);
    }

    return response;
};