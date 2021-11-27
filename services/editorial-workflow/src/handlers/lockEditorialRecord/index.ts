import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { lockEditorialRecord } from './lockEditorialRecord';

export const handle = buildLambdaFunction(lockEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
});
