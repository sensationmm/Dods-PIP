import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { sendEmail } from "./sendEmail";
import { config } from '../../domain';

export const handle = buildLambdaFunction(sendEmail, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: false });