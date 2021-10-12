import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { signIn } from "./signIn";

export const handle = buildLambdaFunction(signIn, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });