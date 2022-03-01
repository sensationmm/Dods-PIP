import { addTeamMemberToClientAccount } from './addTeamMemberToClientAccount';
import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';

export const handle = buildLambdaFunction(addTeamMemberToClientAccount, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, validateSecurity: true });
