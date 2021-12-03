import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { getContent } from "./getContent";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getContent, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });