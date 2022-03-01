import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getSubscriptionTypes } from './getSubscriptionTypes';

export const handle = buildLambdaFunction(getSubscriptionTypes, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true
});
