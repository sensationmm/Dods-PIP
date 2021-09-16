import { buildLambdaFunction } from "../../lambdaMiddleware";
import { health } from "./health";
import { config } from '../../domain';

export const handle = buildLambdaFunction(health, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });