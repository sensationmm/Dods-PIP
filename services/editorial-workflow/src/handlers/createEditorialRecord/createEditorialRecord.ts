import { AsyncLambdaHandler, HttpStatusCode, HttpResponse } from '@dodsgroup/dods-lambda';
import { CreateEditorialRecordParameters } from '../../domain';
import {EditorialRecordRepository} from "../../repositories/EditorialRecordRepository";

export const createEditorialRecord: AsyncLambdaHandler<CreateEditorialRecordParameters> = async ({ document_name, s3_location }) => {
    const recordData: CreateEditorialRecordParameters = {document_name: document_name, s3_location: s3_location};
    const editorialRecord = await EditorialRecordRepository.defaultInstance.createEditorialRecord(recordData);

    return new HttpResponse(HttpStatusCode.OK, editorialRecord);
};