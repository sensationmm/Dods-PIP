import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../domain';
import { deleteContent } from "./deleteContent";

export const handle = buildLambdaFunction(deleteContent, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: true });