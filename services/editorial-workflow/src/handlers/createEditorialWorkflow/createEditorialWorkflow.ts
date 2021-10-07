import { AsyncLambdaHandler, HttpStatusCode, HttpResponse } from '@dodsgroup/dods-lambda';
import { CreateEditorialWorkflowParameters } from '../../domain';

export const createEditorialWorkflow: AsyncLambdaHandler<CreateEditorialWorkflowParameters> = async () => {

    return new HttpResponse(HttpStatusCode.OK, `Hello potato`);
};