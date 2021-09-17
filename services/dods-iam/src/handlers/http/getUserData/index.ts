import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { getUserData } from "./getUserData";

export const handle = buildLambdaFunction(getUserData, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });