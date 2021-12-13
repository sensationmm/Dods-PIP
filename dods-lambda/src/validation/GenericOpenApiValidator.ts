// import { OpenApiValidator } from 'express-openapi-validator/dist/openapi.validator';
import { middleware, } from 'express-openapi-validator';
import { cloneDeep } from 'lodash';
import { OpenApiSpecLoader, Spec } from 'express-openapi-validator/dist/framework/openapi.spec.loader';
import { HttpRequest } from './HttpRequest';
import { OpenApiAdaptedRequest } from './OpenApiAdaptedRequest';
import { OpenApiRequestHandler, OpenApiRequestMetadata, OpenAPIV3, OpenApiValidatorOpts } from 'express-openapi-validator/dist/framework/types';
import { HttpError } from '../domain/error';
import { HttpStatusCode } from '..';
// import { OpenApiContext } from 'express-openapi-validator/dist/framework/openapi.context';
import { buildPipeline } from 'nut-pipe';

export class GenericOpenApiValidator {
  private apiSpec: OpenAPIV3.Document | string;
  private middlewares: OpenApiRequestHandler[];
  private middleware: any;
  // private metadataMiddlewareFunction: OpenApiRequestHandler;
  // private securityMiddlewareFunction: OpenApiRequestHandler;
  // private requestValidationFunction: OpenApiRequestHandler;
  // private responseValidationFunction: OpenApiRequestHandler;
  private metadataIndex: number;
  private static compiledSpec: Promise<Spec>;

  constructor(options: OpenApiValidatorOpts) {
    // const oav = new OpenApiValidator(options);

    this.apiSpec = cloneDeep(options.apiSpec);

    this.middlewares = middleware(options);

    GenericOpenApiValidator.compiledSpec = new OpenApiSpecLoader({ apiDoc: this.apiSpec, validateApiSpec: false, $refParser: { mode: 'dereference' } }).load();
    // const requestHandlers = oav.installMiddleware(GenericOpenApiValidator.compiledSpec);
    // this.metadataMiddlewareFunction = this.middlewares.find(m => m.name === 'metadataMiddleware')!;
    // this.securityMiddlewareFunction = middlewares.find(m => m.name === 'securityMiddleware')!;
    // this.requestValidationFunction = middlewares.find(m => m.name === 'requestMiddleware')!;
    // this.responseValidationFunction = middlewares.find(m => m.name === 'responseMiddleware')!;

    // if (!options.validateResponses) {
    //   this.responseValidationFunction = () => true;
    // }

    // const multipartIndex = this.middlewares.indexOf(this.middlewares.find(m => m.name === 'multipartMiddleware')!);
    // this.middlewares.splice(multipartIndex, 1);

    this.metadataIndex = this.middlewares.indexOf(this.middlewares.find(m => m.name === 'metadataMiddleware')!);
  }

  private static getSchema = (spec: Spec, route: string, method: string): OpenAPIV3.OperationObject => {

    const methodLowerCase = method.toLocaleLowerCase();

    const pathUrl = route;

    const splittedPathUrl = pathUrl.split('/').slice(1);

    const { paths: swagger_paths } = spec.apiDoc;

    const [swagger_path, swagger_pathMethods] = Object.entries(swagger_paths).find(([key]) => {
      const splittedKey = key.split('/').slice(1);
      return key === pathUrl || (splittedKey.length === splittedPathUrl.length && splittedPathUrl.every((item, index) => splittedKey[index].includes('{') || splittedKey[index] == item));
    }) || [];

    if (!swagger_path || !swagger_pathMethods) {
      throw new HttpError(`Bad request:: Swagger ${pathUrl} path not found in Swagger definition.`, HttpStatusCode.BAD_REQUEST);
    }

    const [, swagger_pathMethod] = Object.entries(swagger_pathMethods).find(([key, _]) => key.toLocaleLowerCase() === methodLowerCase) || [];

    if (!swagger_pathMethod) {
      throw new HttpError(`Bad request:: Swagger ${method} method not found in ${swagger_path} path in Swagger definition.`, HttpStatusCode.BAD_REQUEST);
    }

    const schema = swagger_pathMethod;
    // const schema: OpenAPIV3.OperationObject = spec.apiDoc.paths[route] && spec.apiDoc.paths[route][(method.toLowerCase() as keyof OpenAPIV3.PathItemObject)] as OpenAPIV3.OperationObject;

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
    const openApiObject = { openApiRoute: route, expressRoute: route, schema: schema, pathParams: {} };
    const openApiRequest = new OpenApiAdaptedRequest(route, method, inputData.headers, inputData.query, inputData.body, inputData.params, openApiObject);

    const list = this.middlewares.map(middleware => {

      return async (req: any, res: any, next: any) => {

        await new Promise(async (resolve, reject) => {

          middleware(req, res, async (error) => {

            if (error) {
              reject(error);
            } else {
              resolve('ok');
            }
          });

        });

        typeof next === 'function' && await next(req, res);

      };

    });

    list[this.metadataIndex] = async (req, res, next) => {

      // Metadata middleware function modifies openApiRequest object - return params property to previous state
      req.params = openApiRequest.originalParams;
      if (!req.openapi) {
        req.openapi = openApiRequest.openapi as OpenApiRequestMetadata;
      }

      await next(req, res);
    };

    list.push(async () => { });

    this.middleware = buildPipeline(list);

    try {
      await this.middleware(openApiRequest, {});

    } catch (error: any) {

      throw error;
    }



    // //@ts-ignore
    // await this.metadataMiddlewareFunction(openApiRequest, {}, error => {
    //   if (error) {
    //     throw error;
    //   }
    //   // Metadata middleware function modifies openApiRequest object - return params property to previous state
    //   openApiRequest.params = openApiRequest.originalParams;
    //   openApiRequest.openapi.pathParams = openApiRequest.originalParams;
    // });

    // //@ts-ignore
    // await this.requestValidationFunction(openApiRequest, {}, error => {
    //   if (error) {
    //     // Capitalize first letter
    //     const message = (error.message as string).charAt(0).toUpperCase() + (error.message as string).slice(1);
    //     const errorObject = {
    //       message,
    //       statusCode: 400
    //     }
    //     throw errorObject;
    //   }
    // });

    return openApiRequest;
  }

  public validateResponse = async (request: OpenApiAdaptedRequest, _: any): Promise<void> => {

    const contentType = Object.keys(request.openapi.schema.responses["200"]?.content || { 'content': 'application/json' })[0];
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

    // //@ts-ignore
    // await this.responseValidationFunction(request, responseObj, (error) => {
    //   // responseObj.json(response);

    //   if (error) {
    //     // Capitalize first letter
    //     const message = (error.message as string).charAt(0).toUpperCase() + (error.message as string).slice(1);
    //     const errorObject = {
    //       message,
    //       statusCode: 400
    //     }
    //     throw errorObject;
    //   }
    // });

    if (wrappedError) {
      throw wrappedError;
    }
  }
}