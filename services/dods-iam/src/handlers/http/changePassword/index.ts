import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { changePassword } from "./changePassword";

export const handle = buildLambdaFunction(changePassword, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });