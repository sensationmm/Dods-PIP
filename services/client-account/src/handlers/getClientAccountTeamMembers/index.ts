import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getClientAccountTeamMembers } from './getClientAccountTeamMembers';

export const handle = buildLambdaFunction(getClientAccountTeamMembers, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: true,
    validateResponses: false,
    validateSecurity: true
});
