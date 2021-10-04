import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { ClientAccountRepository } from '../../repositories';

export interface AddTeamMemberToClientAccountParameters {
    userId: number;
    clientAccountId: string;
    teamMemberType: string;
}

// const clientAccountTeamRepository = {
//     create: async (data: any) => {
//         console.log(data);
//     }
// }

export const addTeamMemberToClientAccount: AsyncLambdaMiddleware<AddTeamMemberToClientAccountParameters> =
    async ({ userId, clientAccountId, teamMemberType }) => {

        console.log({ userId, clientAccountId, teamMemberType });

        const clientAccount = await ClientAccountRepository.defaultInstance.getClientAccount(clientAccountId);

        console.log(clientAccount);

        // if (clientAccount && clientAccount.subscription_seats && clientAccount.subscription_seats < 1) {
        //     throw new HttpError("Client Account has not enough available seats", HttpStatusCode.FORBIDDEN);
        // }

        // await clientAccountTeamRepository.create({ userId, clientAccountId, teamMemberType });

        // await ClientAccountRepository.defaultInstance.updateClientAcount({ clientAccountId, subscription_seats: clientAccount.subscription_seats! - 1 })

        return new HttpResponse(HttpStatusCode.OK, "Team member was added to the client account");
    };
