import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { publishEditorialRecord } from './publishEditorialRecord';

export const handle = buildLambdaFunction(publishEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});
