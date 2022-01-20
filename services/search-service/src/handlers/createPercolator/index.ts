import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { createPercolator } from "./createPercolator";
import { config } from '../../domain';

export const handle = buildLambdaFunction(createPercolator, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });