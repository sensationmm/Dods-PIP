import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { copyAlertQuery } from './copyAlertQuery';

export const handle = buildLambdaFunction(copyAlertQuery, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
