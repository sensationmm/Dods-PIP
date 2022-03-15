import { autoTagging } from './autoTagging';
import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';

export const handle = buildLambdaFunction(autoTagging, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true
});
