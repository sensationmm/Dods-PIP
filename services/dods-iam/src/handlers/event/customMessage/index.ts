import { buildLambdaFunction, TriggerMiddlewares } from "@dodsgroup/dods-lambda";
import { customMessage } from "./customMessage";

export const handle = buildLambdaFunction(customMessage, { middlewares: TriggerMiddlewares.EventBridgeMiddlewares, validateRequests: false, validateResponses: false });