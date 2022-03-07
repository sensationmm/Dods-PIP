import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../domain';
import { searchCollections } from "./searchCollections";

export const handle = buildLambdaFunction(searchCollections, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: true });