import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { rawQuery } from "./rawQuery";
import { config } from '../../domain';

export const handle = buildLambdaFunction(rawQuery, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });