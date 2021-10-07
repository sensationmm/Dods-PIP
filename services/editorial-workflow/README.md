# dods-lambda

Middleware and observability for API gateway and event triggered lambdas

This package includes:

- HTTP logging
- Event logging
- JSON body serialization
- OpenAPI validation


## Installation

```shell
npm i npm i @dodsgroup/dods-lambda
```

By using this API middleware, you can take the API Gateway handling code out of your Lambda code, and simplify your API code by leaving out CORS and global error handling.

## Prerequisites

In your serverless.yml, you must enable tracing in the provider section

```yml
provider:
  name: aws
  tracing:
    apiGateway: true
    lambda: true
```

## Adding middleware to handlers

There are middleware available for both HTTP triggers, and event triggers. `buildLambdaFunction()` will add some middlewares by default (errorMiddleware, httpLoggerMiddleware, openApiValidatorMiddleware)

Examples:

APIGateway triggered Lambda function 

```ts
import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';

const OKHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => new HttpResponse("OK");

// Adds Error Handling Middleware, HTTP logging Middleware, OpenAPIValidator Middleware to your handler.
export const handle = buildLambdaFunction(OKHandler, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
```

APIGateway triggered Lambda function with strongly Typed Request and Response. Request headers, query parameters, body will be exposed in first parameter as shown in the following sample code. `ChangePasswordParameters` interface has 3 fields. email field can be in header, password field can be in query parameter and newPassword can be in body. You should add or update your endpoint in `./src/openApi.yml`

```ts
import { buildLambdaFunction, AsyncLambdaHandler } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';

export interface ChangePasswordParameters {
    email: string;
    password: string;
    newPassword: string;
}

export const changePassword: AsyncLambdaHandler<ChangePasswordParameters, string> = async ({ email, password, newPassword }) => {

    //Business Logic here :)

    return "OK";
}

// Adds Error Handling Middleware, HTTP logging Middleware, OpenAPIValidator Middleware to your handler.
export const handle = buildLambdaFunction(changePassword, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
```

EventBridge triggered Lambda function

```ts
import { EventBridgeHandler } from "aws-lambda";
import { buildLambdaFunction, AsyncLambdaHandler, TriggerMiddlewares } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';

export const onLoginPasswordEvents: AsyncLambdaHandler<EventBridgeEvent<string, PasswordUpdated, void>> = async (event) => {

    //Business Logic here :)

}

// Adds Error Handling Middleware, Event logging Middleware to your handler.
export const handle = buildLambdaFunction(changePassword, { middlewares: TriggerMiddlewares.EventBridgeMiddlewares, openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
```

EventBridge triggered Lambda function

```ts
import { EventBridgeEvent } from "aws-lambda";
import { buildLambdaFunction, AsyncLambdaHandler, TriggerMiddlewares } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';

export const onLoginPasswordEvents: AsyncLambdaHandler<EventBridgeEvent<string, PasswordUpdated>> = async (event) => {

    //Business Logic here :)

}

// Adds Error Handling Middleware, Event logging Middleware to your handler.
export const handle = buildLambdaFunction(changePassword, { middlewares: TriggerMiddlewares.EventBridgeMiddlewares, openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
```

Injecting new middleware

```ts
import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { buildLambdaFunction, AsyncLambdaHandler, AsyncLambdaMiddleware } from "@dodsgroup/dods-lambda";
import { HttpResponse, HttpStatusCode } from "../domain";

export const sampleMiddleware: AsyncLambdaMiddleware = async (event, context, callback, next) => {

    // write your business logic here

    let response: APIGatewayProxyStructuredResultV2;

    const result = await next(event, context);

    return new HttpResponse(HttpStatusCode.OK, result);
};

const OKHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => new HttpResponse("OK");

// Adds Error Handling Middleware, HTTP logging Middleware, OpenAPIValidator Middleware to your handler.
export const handle = buildLambdaFunction(OKHandler, { middlewares: [...TriggerMiddlewares.APIGatewayMiddlewares, sampleMiddleware], openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
```