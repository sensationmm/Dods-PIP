import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { deleteUserAttributes } from "./deleteUserAttributes";

export const handle = buildLambdaFunction(deleteUserAttributes, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });