import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { health } from "./health";
import { config } from '../../domain';

export const handle = buildLambdaFunction(health, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: true });