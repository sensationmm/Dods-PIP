import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { searchEditorialRecords } from './searchEditorialRecords';

export const handle = buildLambdaFunction(searchEditorialRecords, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
    validateSecurity: false,
});
