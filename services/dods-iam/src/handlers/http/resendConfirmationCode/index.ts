import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { resendConfirmationCode } from "./resendConfirmationCode";

export const handle = buildLambdaFunction(resendConfirmationCode, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });