import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { setAlertSchedule } from './setAlertSchedule';

export const handle = buildLambdaFunction(setAlertSchedule, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
});
