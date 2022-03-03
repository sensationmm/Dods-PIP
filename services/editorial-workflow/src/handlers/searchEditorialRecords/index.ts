import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { searchEditorialRecords } from './searchEditorialRecords';

export const handle = buildLambdaFunction(searchEditorialRecords, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true,
});
