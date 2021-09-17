import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { enableUser } from "./enableUser";

export const handle = buildLambdaFunction(enableUser, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });