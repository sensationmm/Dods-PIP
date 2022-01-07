import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { deleteCollection } from './deleteCollection';

export const handle = buildLambdaFunction(deleteCollection, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
});
