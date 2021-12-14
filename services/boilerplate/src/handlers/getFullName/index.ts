import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { getFullName } from "./getFullName";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getFullName, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: true });