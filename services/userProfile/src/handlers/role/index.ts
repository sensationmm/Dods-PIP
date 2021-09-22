import { buildLambdaFunction } from "../../lambdaMiddleware";
import { role } from "./role";
import { config } from '../../domain/config';

export const handle = buildLambdaFunction(role, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });