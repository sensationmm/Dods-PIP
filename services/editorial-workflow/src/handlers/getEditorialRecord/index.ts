import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getEditorialRecord } from './getEditorialRecord';

export const handle = buildLambdaFunction(getEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
});
