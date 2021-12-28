import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { UpdateEditorialRecordDocumentParameter, UpdateEditorialRecordParameters } from '../../domain';

import { DocumentServiceRepository } from '../../repositories/DocumentServiceRepository';
import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';
import { config } from '../../domain'

export const updateEditorialRecordDocument: AsyncLambdaHandler<UpdateEditorialRecordDocumentParameter> = async (
    params
) => {

    const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(params.recordId);
    const documentARN = record.s3Location;

    const updateDocumentsParams = {
        arn: documentARN,
        document: params.document
    }
    const updatedResponse = await DocumentServiceRepository.defaultInstance.updateDocument(updateDocumentsParams)

    if (updatedResponse) {
        await EditorialRecordRepository.defaultInstance.unassignEditorToRecord(params.recordId)

        const statusId = config.dods.recordStatuses.draft;

        const updateParams: UpdateEditorialRecordParameters = {
            recordId: params.recordId,
            statusId: statusId,
        }

        const updatedEditorialRecord = await EditorialRecordRepository.defaultInstance.updateEditorialRecord(updateParams)

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document and editorial Record updated.',
            data: updatedEditorialRecord
        });
    }

    else {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Imposible to update',
        });
    }

};
