import { AsyncLambdaHandler, HttpStatusCode, HttpResponse } from '@dodsgroup/dods-lambda';
import { CreateEditorialRecordParameters } from '../../domain';

export const createEditorialRecord: AsyncLambdaHandler<CreateEditorialRecordParameters> = async ({ document_name, s3_location }) => {

    return new HttpResponse(HttpStatusCode.OK, {document_name: document_name, s3_location: s3_location, id: "Hello potato"});
};