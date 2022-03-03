import { archiveEditorialRecord } from './archiveEditorialRecord';
import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';

export const handle = buildLambdaFunction(archiveEditorialRecord, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
