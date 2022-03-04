import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { updateAlertQuery } from './updateAlertQuery';

export const handle = buildLambdaFunction(updateAlertQuery, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
