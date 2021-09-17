import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { resetPassword } from "./resetPassword";

export const handle = buildLambdaFunction(resetPassword, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });