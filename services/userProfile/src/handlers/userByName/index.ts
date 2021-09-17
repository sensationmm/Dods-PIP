import { buildLambdaFunction } from "../../lambdaMiddleware";
import { userByName } from "./userByName";
import { config } from '../../domain/config';

export const handle = buildLambdaFunction(userByName, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });