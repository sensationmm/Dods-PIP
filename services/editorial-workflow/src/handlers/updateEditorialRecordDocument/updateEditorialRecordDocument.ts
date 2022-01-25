import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentRepository, EditorialRecordRepository, UpdateEditorialRecordParameters, UpdateEditorialRecordDocumentParameter } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { userProfile } } } = config;

const documentRepository = new DocumentRepository(userProfile);

export const updateEditorialRecordDocument: AsyncLambdaHandler<UpdateEditorialRecordDocumentParameter> = async (params) => {

    const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(params.recordId);
    const documentARN = record.s3Location;

    let { recordId, ...document } = params;

    const updateDocumentsParams = {
        arn: documentARN,
        document: document
    };

    const updatedResponse = await documentRepository.updateDocument(updateDocumentsParams);

    if (updatedResponse) {
        await EditorialRecordRepository.defaultInstance.unassignEditorToRecord(params.recordId);

        const statusId = config.dods.recordStatuses.draft;

        const updateParams: UpdateEditorialRecordParameters = {
            recordId: params.recordId,
            statusId: statusId,
        };

        const updatedEditorialRecord = await EditorialRecordRepository.defaultInstance.updateEditorialRecord(updateParams);

        const response: any = { ...updatedEditorialRecord };
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
