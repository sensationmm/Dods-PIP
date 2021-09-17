import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { confirmRegistration } from "./confirmRegistration";

export const handle = buildLambdaFunction(confirmRegistration, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });