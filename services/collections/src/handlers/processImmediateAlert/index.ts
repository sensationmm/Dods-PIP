import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { processImmediateAlert } from './processImmediateAlert';

export const handle = buildLambdaFunction(processImmediateAlert, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});
