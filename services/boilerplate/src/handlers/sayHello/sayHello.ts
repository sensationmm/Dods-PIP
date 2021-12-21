import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import { SayHelloParameters } from '../../domain';
import { GreetingRepository } from '../../repositories/GreetingRepository';

export const sayHello: AsyncLambdaHandler<SayHelloParameters> = async (data) => {

    let response;

    const { language } = data;

    if (language === 'Turkish') {
        response = await GreetingRepository.defaultInstance.sayTurkishHello(data);
    } else if (language === 'English') {
        response = await GreetingRepository.defaultInstance.sayEnglishHello(data);
    }

    return response;
};