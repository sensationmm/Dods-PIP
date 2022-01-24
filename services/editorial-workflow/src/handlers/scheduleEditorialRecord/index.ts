import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { scheduleEditorialRecord } from './scheduleEditorialRecord';

export const handle = buildLambdaFunction(scheduleEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
});
