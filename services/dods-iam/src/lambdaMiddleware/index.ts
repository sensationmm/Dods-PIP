import YAML from 'yamljs';
import { buildPipeline, AsyncMiddleware, AsyncHandler } from '@dodsgroup/dods-lambda';
import { errorMiddleware, jsonBodyParserMiddleware } from './middlewares';
import { GenericOpenApiValidator } from './validation';

export interface Options {
    [x: string]: any;
    middlewares?: AsyncMiddleware[];
    openApiDocumentPath?: string;
    validateRequests?: boolean;
    validateResponses?: boolean;
}

const defaultOptions: Options = { middlewares: [], openApiDocumentPath: '', validateRequests: true, validateResponses: false };

export const buildLambdaFunctions = <T = AsyncMiddleware>(handlers: Array<T>, options: Options = defaultOptions): AsyncHandler => {

    const { middlewares = [], openApiDocumentPath, validateRequests, validateResponses, ...args } = options || {};

    let openApiDocument;
    let genericOpenApiValidator;

    if (openApiDocumentPath) {
        openApiDocument = YAML.load(openApiDocumentPath);

        if (openApiDocument && validateRequests) {
            genericOpenApiValidator = new GenericOpenApiValidator({ apiSpec: openApiDocument, validateRequests, validateResponses });
        }
    }

    const services: Record<string, any> = { handlers, openApiDocument, genericOpenApiValidator, validateRequests, validateResponses, elapsedMilliseconds: 0, ...args };

    return buildPipeline([errorMiddleware, ...middlewares, jsonBodyParserMiddleware], services);
};

export const buildLambdaFunction = <T = AsyncMiddleware>(handler: T, options: Options = defaultOptions): AsyncHandler => {

    const { middlewares = [], openApiDocumentPath, validateRequests, validateResponses, ...args } = options || {};

    let openApiDocument;
    let genericOpenApiValidator;

    if (openApiDocumentPath) {
        openApiDocument = YAML.load(openApiDocumentPath);

        if (openApiDocument && validateRequests) {
            genericOpenApiValidator = new GenericOpenApiValidator({ apiSpec: openApiDocument, validateRequests, validateResponses });
        }
    }

    const services: Record<string, any> = { openApiDocument, genericOpenApiValidator, validateRequests, validateResponses, elapsedMilliseconds: 0, ...args };

    return buildPipeline([errorMiddleware, ...middlewares, jsonBodyParserMiddleware, handler], services);
};