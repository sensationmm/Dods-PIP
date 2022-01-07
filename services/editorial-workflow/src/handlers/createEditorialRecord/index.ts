import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { createEditorialRecord } from './createEditorialRecord';

export const handle = buildLambdaFunction(createEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true
});
