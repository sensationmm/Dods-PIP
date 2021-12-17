import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentPublishRepository } from '../../repositories/DocumentPublishRepository';
import { DocumentStorageRepository } from '../../repositories/DocumentStorageRepository';
import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';
import { config } from '../../domain';

export const publishEditorialRecord: AsyncLambdaHandler<{ recordId: string }> = async ({
    recordId,
}) => {

    const editorialRecord = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);

    if (editorialRecord.isPublished) {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Record is already published',

        })
    }

    const documentARN = editorialRecord.s3Location;

    let lambdaReponse = false;

    const bucketResponse = await DocumentStorageRepository.defaultInstance.getDocumentByArn(documentARN);

    if (bucketResponse.payload) {
        lambdaReponse = await DocumentPublishRepository.defaultInstance.publishDocument(config.aws.lambdas.contentIndexer, bucketResponse.payload)
    }

    if (bucketResponse.success && lambdaReponse) {

        const updateParams = { recordId, isPublished: true }

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
