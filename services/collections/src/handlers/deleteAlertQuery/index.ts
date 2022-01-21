import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { deleteAlertQuery } from './deleteAlertQuery';

export const handle = buildLambdaFunction(deleteAlertQuery, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: false,
});
