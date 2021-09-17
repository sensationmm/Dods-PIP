import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { forgotPassword } from "./forgotPassword";

export const handle = buildLambdaFunction(forgotPassword, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });