import { buildLambdaFunction } from "../../lambdaMiddleware";
import { getClientAccount } from "./getClientAccount";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getClientAccount, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });