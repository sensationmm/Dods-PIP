import { AsyncLambdaHandler, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { SayLocalHelloParameters } from '../../domain';
import { HttpResponse } from '@dodsgroup/dods-lambda';

export const getFullName: AsyncLambdaHandler<SayLocalHelloParameters> = async ({ title, firstName, lastName }) => {

    return new HttpResponse(HttpStatusCode.OK, `${title} ${firstName} ${lastName}`);
};