import { AsyncLambdaHandler, HttpStatusCode, HttpResponse } from '@dodsgroup/dods-lambda';
import { CreateEditorialRecordParameters } from '../../domain';

export const createEditorialWorkflow: AsyncLambdaHandler<CreateEditorialRecordParameters> = async () => {

    return new HttpResponse(HttpStatusCode.OK, `Hello potato`);
};