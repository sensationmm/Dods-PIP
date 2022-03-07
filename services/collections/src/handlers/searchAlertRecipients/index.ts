import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { searchAlertRecipients } from './searchAlertRecipients';

export const handle = buildLambdaFunction(searchAlertRecipients, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
