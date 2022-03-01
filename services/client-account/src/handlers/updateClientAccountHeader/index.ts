import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { updateClientAccountHeader } from './updateClientAccountHeader';

export const handle = buildLambdaFunction(updateClientAccountHeader, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true
});
