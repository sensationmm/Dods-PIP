import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { updateEditorialRecord } from './updateEditorialRecord';

export const handle = buildLambdaFunction(updateEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
});
