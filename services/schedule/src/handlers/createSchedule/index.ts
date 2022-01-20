import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { createSchedule } from "./createSchedule";
import { config } from '../../domain';

export const handle = buildLambdaFunction(createSchedule, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});