import { HttpRequest, HttpMethod } from "./HttpRequest";
import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";
import { GenericOpenApiValidator } from "./GenericOpenApiValidator";
import { APIGatewayEvent } from "aws-lambda";

const pickFieldValue = (path: string) => {

  const keys = path.split('.');

  return (nestedObj: any) => keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}

export const awsOpenApiRequestAdapter = async (inputData: APIGatewayEvent): Promise<HttpRequest> => {
  const adaptedRequest: HttpRequest = {
    method: inputData.httpMethod.toUpperCase() as HttpMethod || "GET",
    url: inputData.path,
    headers: {},
    rawHeaders: {},
    query: {},
    params: {},
    body: inputData.body && JSON.parse(inputData.body)
  }

  const { schema } = await GenericOpenApiValidator.getOpenApiData(adaptedRequest);
  let requestBody = schema.requestBody as OpenAPIV3.RequestBodyObject;
  if (requestBody) {
    const contentType = Object.keys((requestBody as OpenAPIV3.RequestBodyObject).content)[0];
    adaptedRequest.headers['content-type'] = contentType;
  }

  // adaptedRequest.rawHeaders = inputData.headers;

  if (schema.parameters) {
    for (let parameter of schema.parameters) {
      const parameterObject = parameter as OpenAPIV3.ParameterObject;
      switch (parameterObject.in) {
        case 'header': {
          const fv = pickFieldValue(parameterObject.name)(inputData.headers);
          adaptedRequest.headers[parameterObject.name.toLowerCase()] = fv;
          adaptedRequest.rawHeaders[parameterObject.name] = fv;
          break;
        }
        case 'query': {
          adaptedRequest.query[parameterObject.name] = inputData.queryStringParameters?.[parameterObject.name];
          break;
        }
        case 'path': {
          adaptedRequest.params[parameterObject.name] = inputData.pathParameters?.[parameterObject.name];
          break;
        }
      }
    }
  }
  return adaptedRequest;
}