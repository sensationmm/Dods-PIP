import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { deactivateSchedule } from "./deactivateSchedule";
import { config } from '../../domain';

export const handle = buildLambdaFunction(deactivateSchedule, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });