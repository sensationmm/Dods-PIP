import { APIGatewayProxyEvent } from "aws-lambda";
import { AsyncLambdaMiddlewareWithServices } from "nut-pipe";
import { Logger } from "../utility";
import { awsOpenApiRequestAdapter } from "../validation";

export const openApiValidatorMiddleware: AsyncLambdaMiddlewareWithServices<APIGatewayProxyEvent> = async (event, context, callback, services, next) => {

    const { genericOpenApiValidator, validateRequests, validateResponses } = services!;

    Logger.info(`OpenApiValidatorMiddleware Entry`, { validateRequests, validateResponses });

    let data;
    let openApiRequest;
    let body;

    if (genericOpenApiValidator) {
        const openApiRequestData = await awsOpenApiRequestAdapter(event as any);
        openApiRequest = await genericOpenApiValidator.validateRequest(openApiRequestData);
        data = { ...openApiRequestData.rawHeaders, ...openApiRequestData.params, ...openApiRequestData.query };
        body = openApiRequestData.body;
        Object.assign(data, body);
    } else {
        data = { ...event.queryStringParameters, ...event.headers, ...event.pathParameters };

        body = event.body;

        if (body && typeof body === 'string') {
            let parsedBody: any;
            try {
                parsedBody = JSON.parse(body);
            } catch {
                throw new Error('invalid body, expected JSON');
            }

            Object.assign(data, parsedBody);
        } else {
            Object.assign(data, body);
        }
    }

    const response = await next!(data as any, context, callback);

    if (genericOpenApiValidator && openApiRequest) {
        await genericOpenApiValidator.validateResponse(openApiRequest, response);
    }

    Logger.info(`OpenApiValidatorMiddleware Success`);

    return response;
};