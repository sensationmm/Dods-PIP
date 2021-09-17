import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { resendConfirmationCode } from "./resendConfirmationCode";

export const handle = buildLambdaFunction(resendConfirmationCode, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });