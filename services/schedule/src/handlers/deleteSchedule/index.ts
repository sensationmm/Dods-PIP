import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { deleteSchedule } from "./deleteSchedule";
import { config } from '../../domain';

export const handle = buildLambdaFunction(deleteSchedule, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });