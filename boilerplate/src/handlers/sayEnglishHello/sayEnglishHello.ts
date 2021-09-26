import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import { SayLocalHelloParameters } from '../../domain';
import { GreetingRepository } from '../../repositories/GreetingRepository';

export const sayEnglishHello: AsyncLambdaHandler<SayLocalHelloParameters> = async (data) => {

    const fullName = await GreetingRepository.defaultInstance.getFullName(data);

    const response = `Hello ${fullName}`;
    
    return response;
};