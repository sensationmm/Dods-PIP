import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getCollectionAlerts } from './getCollectionAlerts';

export const handle = buildLambdaFunction(getCollectionAlerts, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});
