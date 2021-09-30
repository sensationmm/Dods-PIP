import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { config } from '../../../domain';
import { getUserData } from "./getUserData";

export const handle = buildLambdaFunction(getUserData, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });