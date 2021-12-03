import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { removeTeamMember } from './removeTeamMember';

export const handle = buildLambdaFunction(removeTeamMember, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false, });
