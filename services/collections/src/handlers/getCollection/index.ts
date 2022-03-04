import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../domain';
import { getCollection } from "./getCollection";

export const handle = buildLambdaFunction(getCollection, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: true });