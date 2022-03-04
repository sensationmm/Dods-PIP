import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { createAlertQuery } from './createAlertQuery';

export const handle = buildLambdaFunction(createAlertQuery, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
