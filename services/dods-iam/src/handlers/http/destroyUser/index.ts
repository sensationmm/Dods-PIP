import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { destroyUser } from "./destroyUser";

export const handle = buildLambdaFunction(destroyUser, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });