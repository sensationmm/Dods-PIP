import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { signOut } from "./signOut";

export const handle = buildLambdaFunction(signOut, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });