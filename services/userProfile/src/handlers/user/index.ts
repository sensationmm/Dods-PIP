import { buildLambdaFunction } from "../../lambdaMiddleware";
import { user } from "./user";
import { config } from '../../domain/config';

export const handle = buildLambdaFunction(user, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });