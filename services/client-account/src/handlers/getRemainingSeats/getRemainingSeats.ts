import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { GetClientAccountParameters } from '../../domain';

export const getRemainingSeats: AsyncLambdaMiddleware<GetClientAccountParameters> =
    async (parameters) => {
        console.log('-----clientAcccount ');
        console.log(parameters.clientAccountId);
        const clientAccountUsers =
            await ClientAccountRepository.defaultInstance.getClientAccountUsers(
                parameters.clientAccountId
            );

        const clientAccountSuscriptedSeats: any =
            await ClientAccountRepository.defaultInstance.getClientAccountSeats(
                parameters.clientAccountId
            );

        //const occupiedSeats:number= clientAccountUsers.dataValues.UserProfileModels.length;

        // const UsersPerClientObj:any = clientAccountUsers.get('UserProfileModels');
        // console.log('------------------- Client Account Users-----------------');
        // const occupiedSeats= Object.keys(UsersPerClientObj).length
        const availableSeats: number =
            clientAccountSuscriptedSeats - clientAccountUsers;

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: `Remaining Seats ${availableSeats}`,
            data: availableSeats,
        });
    };
