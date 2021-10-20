import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';
import { GetClientAccountParameters } from '../../domain';

export const getClientAccountTeamMembers: AsyncLambdaMiddleware<GetClientAccountParameters> =
    async (parameters) => {
        const teamMembers = await ClientAccountRepository.defaultInstance.getClientAccountTeam(
            parameters.clientAccountId
        );

        return new HttpResponse(HttpStatusCode.OK, {
            message: 'Client account found.',
            data: teamMembers,
        });
    };
