import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

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

    const bucketResponse = await DocumentRepository.defaultInstance.getDocumentByArnV1(documentARN);

    if (bucketResponse.payload) {

        const dataPayload = { body: JSON.parse(bucketResponse.payload) }
        lambdaReponse = await DocumentRepository.defaultInstance.publishDocumentV1(config.aws.lambdas.contentIndexer, JSON.stringify(dataPayload))
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
            message: 'Editorial Record not published',
        });
    }
};
