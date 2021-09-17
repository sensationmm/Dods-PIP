import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { signUp } from "./signUp";

export const handle = buildLambdaFunction(signUp, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });