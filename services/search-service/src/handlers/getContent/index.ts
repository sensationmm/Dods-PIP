import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../domain';
import { getContent } from "./getContent";

export const handle = buildLambdaFunction(getContent, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
export const handleInternal = buildLambdaFunction(getContent, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });