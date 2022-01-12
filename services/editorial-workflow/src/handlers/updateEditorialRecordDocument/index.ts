import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { updateEditorialRecordDocument } from './updateEditorialRecordDocument';

export const handle = buildLambdaFunction(updateEditorialRecordDocument, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
});
