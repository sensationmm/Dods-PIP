import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { role } from "./role";
import { config } from '../../domain/config';

export const handle = buildLambdaFunction(role, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });