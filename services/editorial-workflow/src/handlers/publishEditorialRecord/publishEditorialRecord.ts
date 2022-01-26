import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { userProfile } } } = config;

const documentRepository = new DocumentRepository(userProfile);

export const publishEditorialRecord: AsyncLambdaHandler<{ recordId: string }> = async ({ recordId }) => {

    const editorialRecord = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);

    if (editorialRecord.isPublished) {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Record is already published',

        });
    }

    const documentARN = editorialRecord.s3Location;

    let lambdaReponse = false;

    const bucketResponse = await documentRepository.getDocumentByArn(documentARN);

    if (bucketResponse.payload) {

        const dataPayload = { data: bucketResponse.payload };
        lambdaReponse = await documentRepository.publishDocument(config.aws.lambdas.contentIndexer, JSON.stringify(dataPayload));
    }

    if (bucketResponse.success && lambdaReponse) {

        const updateParams = { recordId, isPublished: true };
        const updatedRecord = await EditorialRecordRepository.defaultInstance.updateEditorialRecord(updateParams);

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record Published',
            data: updatedRecord,
        });
    }
    else {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: bucketResponse.payload,

        });
    }
};
