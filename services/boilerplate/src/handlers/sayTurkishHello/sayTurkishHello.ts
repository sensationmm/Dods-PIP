import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import { SayLocalHelloParameters } from '../../domain';
import { GreetingRepository } from '../../repositories/GreetingRepository';

export const sayTurkishHello: AsyncLambdaHandler<SayLocalHelloParameters> = async (data) => {

    const fullName = await GreetingRepository.defaultInstance.getFullName(data);

    const response = `Merhaba ${fullName}`;

    return response;
};