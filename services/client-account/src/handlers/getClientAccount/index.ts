import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../domain';
import { getClientAccount } from "./getClientAccount";

export const handle = buildLambdaFunction(getClientAccount, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });