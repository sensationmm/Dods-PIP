import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { HttpSuccessResponse } from '../../domain';

//Obtengo el client ID y ya miro que hago con el, la idea es mirar las sillas 
export const getRemainingSeats = async ({
    clientAccountId,
}: {
    clientAccountId: string;
}): Promise<APIGatewayProxyResultV2> => {
    
    const response= 
    await ClientAccountRepository.defaultInstance.getRemainingSeats(
            clientAccountId
    );
    console.log(clientAccountId)
    return new HttpSuccessResponse(
        `Remaining Seats ${response}`
    );
};
