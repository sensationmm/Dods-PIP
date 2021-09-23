import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { HttpSuccessResponse } from '../../domain';

//Obtengo el client ID y ya miro que hago con el, la idea es mirar las sillas 
export const getRemainingSeats = async ({
    clientAccountId,
}: {
    clientAccountId: string;
}): Promise<APIGatewayProxyResultV2> => {
    
    const clientAccountUsers=
    await ClientAccountRepository.defaultInstance.getClientAccountUsers(
        clientAccountId
    );

    const clientAccountSuscriptedSeats=
    await ClientAccountRepository.defaultInstance.getClientAccountSeats(
        clientAccountId
    );

    const occupiedSeats:number= clientAccountUsers.dataValues.UserProfileModels.length;
    const availableSeats:number= clientAccountSuscriptedSeats-occupiedSeats;
 
    return new HttpSuccessResponse(
        `Remaining Seats ${availableSeats}`
    );
};
