import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { checkClientAccountName } from './checkClientAccountName';
import { config } from '../../domain';

export const handle = buildLambdaFunction(checkClientAccountName, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
});
