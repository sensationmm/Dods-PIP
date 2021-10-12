import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getRemainingSeats } from './getRemainingSeats';

export const handle = buildLambdaFunction(getRemainingSeats, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: false,
});
