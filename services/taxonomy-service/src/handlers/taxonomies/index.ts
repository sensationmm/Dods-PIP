import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { getTaxonomies } from "./getTaxonomies";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getTaxonomies, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });