import { buildLambdaFunction } from "../../lambdaMiddleware";
import { getSubscriptionTypes } from "./getSubscriptionTypes";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getSubscriptionTypes, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });