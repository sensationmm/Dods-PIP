import { buildLambdaFunction } from "../../lambdaMiddleware";
import { searchClientAccount } from "./searchClientAccount";
import { config } from '../../domain';

export const handle = buildLambdaFunction(searchClientAccount, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });