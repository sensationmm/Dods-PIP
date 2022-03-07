import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { setAlertRecipients } from './setAlertRecipients';

export const handle = buildLambdaFunction(setAlertRecipients, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
