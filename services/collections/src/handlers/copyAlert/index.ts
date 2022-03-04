import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { copyAlert } from './copyAlert';

export const handle = buildLambdaFunction(copyAlert, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
