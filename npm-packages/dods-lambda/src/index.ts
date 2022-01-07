import YAML from 'yamljs';
import { buildPipeline, AsyncMiddleware, AsyncHandler } from 'nut-pipe';
import { errorMiddleware, eventLogerMiddleware, httpLogerMiddleware, openApiValidatorMiddleware, bearerAuthenticationMiddleware, corsMiddleware } from './middlewares';
import { GenericOpenApiValidator } from './validation';

export * from "@dodsgroup/dods-domain";

export * from 'nut-pipe';

export * from './utility';

export class TriggerMiddlewares {
    static APIGatewayMiddlewares = [httpLogerMiddleware, corsMiddleware, openApiValidatorMiddleware, bearerAuthenticationMiddleware];
    static EventBridgeMiddlewares = [eventLogerMiddleware];
}

export interface Options {
    [x: string]: any;
    middlewares?: AsyncMiddleware[];
    openApiDocumentPath?: string;
    validateRequests?: boolean;
    validateResponses?: boolean;
    validateSecurity?: boolean;
}

const defaultOptions: Options = { middlewares: TriggerMiddlewares.APIGatewayMiddlewares, openApiDocumentPath: '', validateRequests: true, validateResponses: false };

export const buildLambdaFunction = <T extends AsyncMiddleware>(handler: T, options: Options = defaultOptions): AsyncHandler => {

    const { middlewares = TriggerMiddlewares.APIGatewayMiddlewares, openApiDocumentPath, validateRequests, validateResponses, validateSecurity, ...args } = options || {};

    let openApiDocument;
    let genericOpenApiValidator;

    if (openApiDocumentPath) {
        openApiDocument = YAML.load(openApiDocumentPath);

        if (openApiDocument && validateRequests) {
            genericOpenApiValidator = new GenericOpenApiValidator({ apiSpec: openApiDocument, validateRequests, validateResponses, validateSecurity });
        }
    }

    const services: Record<string, any> = { openApiDocument, genericOpenApiValidator, validateRequests, validateResponses, validateSecurity, elapsedMilliseconds: 0, ...args };

    return buildPipeline([errorMiddleware, ...middlewares, handler], services);
};