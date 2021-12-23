import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../domain';
import { updateDocument } from "./updateDocument";

export const handle = buildLambdaFunction(updateDocument, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });