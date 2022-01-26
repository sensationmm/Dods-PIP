import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { getSchedule } from "./getSchedule";
import { config } from '../../domain';

export const handle = buildLambdaFunction(getSchedule, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });