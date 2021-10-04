import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../domain';
import { health } from "./health";

export const handle = buildLambdaFunction(health, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });