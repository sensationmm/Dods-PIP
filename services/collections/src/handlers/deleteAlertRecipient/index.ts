import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { deleteAlertRecipient } from './deleteAlertRecipient';

export const handle = buildLambdaFunction(deleteAlertRecipient, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
