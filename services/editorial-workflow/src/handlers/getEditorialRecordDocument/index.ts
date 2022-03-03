import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getEditorialRecordDocument } from './getEditorialRecordDocument';

export const handle = buildLambdaFunction(getEditorialRecordDocument, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
