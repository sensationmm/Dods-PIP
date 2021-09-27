import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import { SayLocalHelloParameters } from '../../domain';

export const getFullName: AsyncLambdaHandler<SayLocalHelloParameters> = async ({ title, firstName, lastName }) => {

    return `${title} ${firstName} ${lastName}`;
};