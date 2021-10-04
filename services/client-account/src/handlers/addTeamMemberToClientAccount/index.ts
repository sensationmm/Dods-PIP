import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { addTeamMemberToClientAccount } from './addTeamMemberToClientAccount';

export const handle = buildLambdaFunction(addTeamMemberToClientAccount, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });
