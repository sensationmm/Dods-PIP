import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { searchClientAccount } from './searchClientAccount';

export const handle = buildLambdaFunction(searchClientAccount, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true
});
