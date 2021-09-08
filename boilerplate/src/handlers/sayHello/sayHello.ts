import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpSuccessResponse } from '../../domain/http';
import { SayHelloParameters } from '../../domain/interfaces';
import { GreetingRepository } from '../../repositories/GreetingRepository';

export const sayHello = async (requestPayload: SayHelloParameters): Promise<APIGatewayProxyResultV2> => {


    // console.log('Entry: sayHello');

    // if (!requestPayload.firstName) {
    //     throw new HttpBadRequestError("Request QueryString should contain firstName field.");
    // } else if (!requestPayload.lastName) {
    //     throw new HttpBadRequestError("Request QueryString should contain lastName field.");
    // } else if (!requestPayload.title) {
    //     throw new HttpBadRequestError("Request QueryString should contain lastName field.");
    // } else if (!requestPayload.language) {
    //     throw new HttpBadRequestError("Request QueryString should contain lastName field.");
    // }

    // let response;
    // try {

    //     if (requestPayload.language === 'Turkish') {
    //         response = await GreetingRepository.defaultInstance.sayTurkishHello(requestPayload);
    //     } else if (requestPayload.language === 'English') {
    //         response = await GreetingRepository.defaultInstance.sayEnglishHello(requestPayload);
    //     }

    // } catch (error) {
    //     console.error('Error: sayHello is failed', error);
    //     throw error;
    // }

    // console.log('Success: sayHello');

    // return new HttpSuccessResponse(response);




    let response;

    if (requestPayload.language === 'Turkish') {
        response = await GreetingRepository.defaultInstance.sayTurkishHello(requestPayload);
    } else if (requestPayload.language === 'English') {
        response = await GreetingRepository.defaultInstance.sayEnglishHello(requestPayload);
    }

    return new HttpSuccessResponse(response);
};