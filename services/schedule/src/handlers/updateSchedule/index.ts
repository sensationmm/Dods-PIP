import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { updateSchedule } from "./updateSchedule";
import { config } from '../../domain';

export const handle = buildLambdaFunction(updateSchedule, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });