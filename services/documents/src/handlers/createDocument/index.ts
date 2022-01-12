import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { createDocument } from "./createDocument";
import { config } from '../../domain';

export const handle = buildLambdaFunction(createDocument, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: false });