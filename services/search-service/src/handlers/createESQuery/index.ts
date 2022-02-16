import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { createESQuery } from "./createESQuery";
import { config } from '../../domain';

export const handle = buildLambdaFunction(createESQuery, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });