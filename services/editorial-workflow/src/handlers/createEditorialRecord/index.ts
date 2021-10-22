import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { createEditorialRecord } from "./createEditorialRecord";
import { config } from '../../domain';

export const handle = buildLambdaFunction(createEditorialRecord, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });