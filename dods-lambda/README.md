# dods-lambda

Middleware and observability for API gateway and event triggered lambdas

This package includes:

- HTTP logging
- Event logging
- JSON body serialization
- OpenAPI validation

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

APIGateway triggered Lambda function with strongly Typed Request and Response 

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

export const onLoginPasswordEvents: EventBridgeHandler<string, PasswordUpdated, void> = async (event) => {

    //Business Logic here :)

}

// Adds Error Handling Middleware, Event logging Middleware to your handler.
export const handle = buildLambdaFunction(changePassword, { middlewares: [...TriggerMiddlewares.EventBridgeMiddlewares], openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
```

EventBridge triggered Lambda function

```ts
import { buildLambdaFunction, AsyncLambdaHandler, TriggerMiddlewares } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';

export const onLoginPasswordEvents: AsyncLambdaHandler<EventBridgeEvent<string, PasswordUpdated>> = async (event) => {

    //Business Logic here :)

}

// Adds Error Handling Middleware, Event logging Middleware to your handler.
export const handle = buildLambdaFunction(changePassword, { middlewares: [...TriggerMiddlewares.EventBridgeMiddlewares], openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
```