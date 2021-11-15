import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { getDocument } from "./getDocument";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getDocument, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });