import { buildLambdaFunction, TriggerMiddlewares } from "@dodsgroup/dods-lambda";
import { onLoginPasswordEvents } from "./onLoginPasswordEvents";

export const handle = buildLambdaFunction(onLoginPasswordEvents, { middlewares: TriggerMiddlewares.EventBridgeMiddlewares, validateRequests: false, validateResponses: false });