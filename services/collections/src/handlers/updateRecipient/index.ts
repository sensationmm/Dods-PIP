import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { updateRecipient } from './updateRecipient';

export const handle = buildLambdaFunction(updateRecipient, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: false,
});
