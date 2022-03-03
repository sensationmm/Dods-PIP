import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getClientAccountsByUser } from './getClientAccountsByUser';

export const handle = buildLambdaFunction(getClientAccountsByUser, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true
});
