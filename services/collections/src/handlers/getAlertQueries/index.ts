import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getAlertQueries } from './getAlertQueries';

export const handle = buildLambdaFunction(getAlertQueries, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: true,
});
