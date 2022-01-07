import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { getCollection } from "./getCollection";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getCollection, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: false });