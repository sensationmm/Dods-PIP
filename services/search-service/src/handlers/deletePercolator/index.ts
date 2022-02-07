import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { deletePercolator } from "./deletePercolator";
import { config } from '../../domain';

export const handle = buildLambdaFunction(deletePercolator, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });