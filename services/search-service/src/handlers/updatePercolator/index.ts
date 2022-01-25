import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { updatePercolator } from "./updatePercolator";
import { config } from '../../domain';

export const handle = buildLambdaFunction(updatePercolator, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });