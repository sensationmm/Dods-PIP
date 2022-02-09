import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { editPublishedDocument } from './editPublishedDocument';

export const handle = buildLambdaFunction(editPublishedDocument, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: false,
});
