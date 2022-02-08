import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { triggerInstantAlert } from './triggerInstantAlert';

export const handle = buildLambdaFunction(triggerInstantAlert, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});
