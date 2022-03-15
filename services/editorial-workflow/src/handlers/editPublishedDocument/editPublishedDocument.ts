import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { AwsService, DefaultAwsService, DocumentRepository, EditPublishedDocumentParameters, EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';
import moment from 'moment';

//import { v4 as uuidv4 } from 'uuid';

const { dods: { downstreamEndpoints: { userProfile } } } = config;
const { aws: { region, buckets: { documents: documentsBucket }, keys: { api_key } } } = config;
const awsService: AwsService = new DefaultAwsService(region);
export const editPublishedDocument: AsyncLambdaHandler<EditPublishedDocumentParameters> = async (params) => {

    try {
        const documentId = params.documentId;
        const documentResponse: any = await DocumentRepository.defaultInstance.getDocumentById(documentId, userProfile, api_key);
        let editedDocumentResponse = documentResponse.data;
        //editedDocumentResponse.documentId = uuidv4().replace(/-/g, '');
        editedDocumentResponse.version = "2.0";
        //editedDocumentResponse.ingestedDateTime = "";
        editedDocumentResponse.createdDateTime = new Date();
        delete editedDocumentResponse.aggs_fields;

        const { contentSource, informationType, createdDateTime, documentTitle } = editedDocumentResponse;
        const fileKey = `${contentSource}/${informationType}/${moment(createdDateTime).format('DD-MM-YYYY')}/${documentTitle}.json`;

        await awsService.putInS3(documentsBucket, fileKey, editedDocumentResponse);

        const createEditorialRecordParams = {
            documentName: documentTitle,
            s3Location: `arn:aws:s3:::${documentsBucket}/${fileKey}`,
            informationType: informationType,
            contentSource: contentSource,
            statusId: config.dods.recordStatuses.created
        }

        const newRecord = await EditorialRecordRepository.defaultInstance.createEditorialRecord(createEditorialRecordParams);

        let { s3Location, ...recordResponse } = newRecord;


        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record Created.',
            data: recordResponse
        });

    } catch (error) {

        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Please verify document information',
        });

    }

};
