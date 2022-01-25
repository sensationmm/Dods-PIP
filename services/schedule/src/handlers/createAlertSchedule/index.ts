import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { createAlertSchedule } from "./createAlertSchedule";
import { config } from '../../domain';

export const handle = buildLambdaFunction(createAlertSchedule, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});