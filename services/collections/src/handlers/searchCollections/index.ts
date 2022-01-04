import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { searchCollections } from "./searchCollections";
import { config } from '../../domain';

export const handle = buildLambdaFunction(searchCollections, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: false });