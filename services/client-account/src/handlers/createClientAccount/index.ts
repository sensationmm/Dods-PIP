import { buildLambdaFunction } from '../../lambdaMiddleware';
import { config } from '../../domain';
import { createClientAccount } from './createClientAccount';

export const handle = buildLambdaFunction(createClientAccount, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
});
