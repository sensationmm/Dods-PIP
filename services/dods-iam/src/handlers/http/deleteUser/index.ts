import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { deleteUser } from "./deleteUser";

export const handle = buildLambdaFunction(deleteUser, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });