import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { updateUserAttributes } from "./updateUserAttributes";

export const handle = buildLambdaFunction(updateUserAttributes, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });