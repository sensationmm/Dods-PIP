import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { createUser } from './createUser';

export const handle = buildLambdaFunction(createUser, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
});
