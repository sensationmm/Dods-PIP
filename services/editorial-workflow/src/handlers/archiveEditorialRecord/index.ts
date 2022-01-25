import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { archiveEditorialRecord } from './archiveEditorialRecord';

export const handle = buildLambdaFunction(archiveEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: false,
});
