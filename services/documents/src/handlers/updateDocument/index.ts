import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { updateDocument } from "./updateDocument";
import { config } from '../../domain';

export const handle = buildLambdaFunction(updateDocument, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });