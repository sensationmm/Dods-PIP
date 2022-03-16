import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { DocumentRepository, EditorialRecordRepository, UpdateEditorialRecordDocumentParameter, UpdateEditorialRecordParameters } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { userProfile } } } = config;
const { aws: { keys: { api_key } } } = config
const documentRepository = new DocumentRepository(userProfile);

export const updateEditorialRecordDocument: AsyncLambdaHandler<UpdateEditorialRecordDocumentParameter> = async (params) => {

    const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(params.recordId);
    const documentARN = record.s3Location;

    let { recordId, ...document } = params;

    const { contentSource, informationType, documentTitle } = params

    const updateDocumentsParams = {
        arn: documentARN,
        document: document
    };

    const updatedResponse: any = await documentRepository.updateDocument(updateDocumentsParams, api_key);

    const contentDateTime = updatedResponse.payload.contentDateTime

    if (updatedResponse.success) {
        await EditorialRecordRepository.defaultInstance.unassignEditorToRecord(params.recordId);

        let statusId = record.status?.uuid
        if (statusId !== config.dods.recordStatuses.scheduled) {
            statusId = config.dods.recordStatuses.draft;
        }

        const updateParams: UpdateEditorialRecordParameters = {
            recordId: params.recordId,
            statusId: statusId,
            documentName: documentTitle,
            contentSource,
            informationType

        };

        const updatedEditorialRecord = await EditorialRecordRepository.defaultInstance.updateEditorialRecord(updateParams);

        const response: any = { ...updatedEditorialRecord, contentDateTime: contentDateTime };
        delete response.s3Location;

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document and editorial Record updated.',
            data: response
        });
    }
    else {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Imposible to update',
        });
    }
};
