import { OpenApiValidator } from 'express-openapi-validator/dist/openapi.validator';
import { cloneDeep } from 'lodash';
import { OpenApiSpecLoader, Spec } from 'express-openapi-validator/dist/framework/openapi.spec.loader';
import { HttpRequest } from './HttpRequest';
import { OpenApiAdaptedRequest } from './OpenApiAdaptedRequest';
import { OpenApiRequestHandler, OpenAPIV3, OpenApiValidatorOpts } from 'express-openapi-validator/dist/framework/types';

export class GenericOpenApiValidator {
  private metadataMiddlewareFunction: OpenApiRequestHandler;
  private requestValidationFunction: OpenApiRequestHandler;
  private responseValidationFunction: OpenApiRequestHandler;
  private static compiledSpec: Promise<Spec>;

  constructor(options: OpenApiValidatorOpts) {
    const oav = new OpenApiValidator(options);

    GenericOpenApiValidator.compiledSpec = new OpenApiSpecLoader({ apiDoc: cloneDeep(options.apiSpec), validateApiSpec: false, $refParser: { mode: 'dereference' } }).load();
    const requestHandlers = oav.installMiddleware(GenericOpenApiValidator.compiledSpec);
    this.metadataMiddlewareFunction = requestHandlers.find(m => m.name === 'metadataMiddleware')!;
    this.requestValidationFunction = requestHandlers.find(m => m.name === 'requestMiddleware')!;
    this.responseValidationFunction = requestHandlers.find(m => m.name === 'responseMiddleware')!;

    if (!options.validateResponses) {
      this.responseValidationFunction = () => true;
    }
  }

  private static getSchema = (spec: Spec, route: string, method: string): OpenAPIV3.OperationObject => {

    const schema: OpenAPIV3.OperationObject = spec.apiDoc.paths[route] && spec.apiDoc.paths[route][(method.toLowerCase() as keyof OpenAPIV3.PathItemObject)] as OpenAPIV3.OperationObject;

    if (!schema) {
      //TODO: Declare error message
      throw 'Function not part of openAPI';
    }

    return schema;
  }

  public static getOpenApiData = async (inputData: HttpRequest): Promise<{ route: string, method: string, schema: OpenAPIV3.OperationObject }> => {

    const resolvedSpec = await GenericOpenApiValidator.compiledSpec;
    const routeWithQueryParams: string = inputData.url.indexOf('/api') !== -1 ? inputData.url.split('/api')[1] : inputData.url;
    let route = routeWithQueryParams.split('?')[0];
    if (inputData.params) {
      for (let paramKey of Object.keys(inputData.params)) {
        const paramValue = inputData.params[paramKey];
        route = route.replace(`/${paramValue}`, `/{${paramKey}}`);
      }
    }

    const method: string = inputData.method || "GET";
    const schema: OpenAPIV3.OperationObject = GenericOpenApiValidator.getSchema(resolvedSpec, route, method);
    return { route, method, schema };
  }

  public validateRequest = async (inputData: HttpRequest): Promise<OpenApiAdaptedRequest> => {
    const { route, method, schema } = await GenericOpenApiValidator.getOpenApiData(inputData);
    const openApiObject = { expressRoute: route, schema: schema, pathParams: {} };
    const openApiRequest = new OpenApiAdaptedRequest(route, method, inputData.headers, inputData.query, inputData.body, inputData.params, openApiObject);

    //@ts-ignore
    await this.metadataMiddlewareFunction(openApiRequest, {}, error => {
      if (error) {
        throw error;
      }
      // Metadata middleware function modifies openApiRequest object - return params property to previous state
      openApiRequest.params = openApiRequest.originalParams;
      openApiRequest.openapi.pathParams = openApiRequest.originalParams;
    });

    //@ts-ignore
    await this.requestValidationFunction(openApiRequest, {}, error => {
      if (error) {
        // Capitalize first letter
        const message = (error.message as string).charAt(0).toUpperCase() + (error.message as string).slice(1);
        const errorObject = {
          message,
          statusCode: 400
        }
        throw errorObject;
      }
    });

    return openApiRequest;
  }

  public validateResponse = async (request: OpenApiAdaptedRequest, _: any): Promise<void> => {

    const contentType = Object.keys(request.openapi.schema.responses["200"].content)[0];
    // These properties are required for responseValidationFunction to work
    // It is dependent on res object from express which has these properties
    const responseObj = {
      headers: {
        'content-type': contentType
      },
      statusCode: 200,
      json: () => {
        return;
      },
      getHeaders: () => {
        return responseObj.headers
      }

    }
    let wrappedError;

    //@ts-ignore
    await this.responseValidationFunction(request, responseObj, (error) => {
      // responseObj.json(response);

      if (error) {
        // Capitalize first letter
        const message = (error.message as string).charAt(0).toUpperCase() + (error.message as string).slice(1);
        const errorObject = {
          message,
          statusCode: 400
        }
        throw errorObject;
      }
    });

    if (wrappedError) {
      throw wrappedError;
    }
  }
}