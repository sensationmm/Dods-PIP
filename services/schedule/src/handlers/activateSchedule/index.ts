import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { activateSchedule } from "./activateSchedule";
import { config } from '../../domain';

export const handle = buildLambdaFunction(activateSchedule, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });