import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpSuccessResponse, SayHelloParameters } from '../../domain';
import { GreetingRepository } from '../../repositories/GreetingRepository';

export const sayHello = async (requestPayload: SayHelloParameters): Promise<APIGatewayProxyResultV2> => {

    let response;

    if (requestPayload.language === 'Turkish') {
        response = await GreetingRepository.defaultInstance.sayTurkishHello(requestPayload);
    } else if (requestPayload.language === 'English') {
        response = await GreetingRepository.defaultInstance.sayEnglishHello(requestPayload);
    }

    return new HttpSuccessResponse(response);
};