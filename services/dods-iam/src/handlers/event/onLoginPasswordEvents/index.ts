import { buildLambdaFunction, TriggerMiddlewares } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { onLoginPasswordEvents } from "./onLoginPasswordEvents";

export const handle = buildLambdaFunction(onLoginPasswordEvents, { middlewares: TriggerMiddlewares.EventBridgeMiddlewares, openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });