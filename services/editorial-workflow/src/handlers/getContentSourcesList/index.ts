import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getContentSourcesList } from './getContentSourcesList';

export const handle = buildLambdaFunction(getContentSourcesList, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});
