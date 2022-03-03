import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { unscheduleEditorialRecord } from './unscheduleEditorialRecord';

export const handle = buildLambdaFunction(unscheduleEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
