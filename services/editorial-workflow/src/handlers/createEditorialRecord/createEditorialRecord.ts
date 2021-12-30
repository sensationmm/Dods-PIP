import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CreateEditorialRecordParameters, EditorialDocument, config, } from '../../domain';

import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';
import { S3 } from '@aws-sdk/client-s3';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const { aws: { region, buckets: { documents: documentsBucket } } } = config;

const s3 = new S3({ region: region });

export const isCreateEditorialRecordParameters = (params: any): params is CreateEditorialRecordParameters => 's3Location' in params;

export const createEditorialRecordV1 = async (params: CreateEditorialRecordParameters) => {
    const { statusId, assignedEditorId } = params;

    if (assignedEditorId) {
        const validUserId = await EditorialRecordRepository.defaultInstance.checkUserId(
            assignedEditorId
        );
        if (!validUserId) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: `Error: can not find user with id: ${assignedEditorId}`,
            });
        }
    }

    if (statusId) {
        const validStatus = Object.values(config.dods.recordStatuses).includes(statusId);
        if (!validStatus) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: `Error: invalid statusId: ${statusId}`,
            });
        }
        if (statusId === config.dods.recordStatuses.inProgress && !assignedEditorId) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Error: In-progress status requires a record with an Assigned Editor',
            });
        }
    }

    const newRecord = await EditorialRecordRepository.defaultInstance.createEditorialRecord(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Editorial Record created.',
        data: newRecord,
    });
};

export const createEditorialRecordV2 = async (params: EditorialDocument) => {

    params = {
        ...params,
        jurisdiction: 'UK',
        sourceReferenceFormat: 'text/html',
        internallyCreated: true,
        schemaType: 'Internal',
        contentDateTime: new Date(),
        createdDateTime: new Date(),
        ingestedDateTime: new Date(),
        version: '1.0',
        language: 'en',
        originalContent: '',
    }
    if (!params.taxonomyTerms) {
        params.taxonomyTerms = [];
    }

    const documentName: any = params.documentTitle;

    const { contentSource, informationType, createdDateTime } = params as EditorialDocument;

    const fileKey = `${contentSource}/${informationType}/${moment(createdDateTime).format('DD-MM-YYYY')}/${documentName}.json`;

    const document = params;
    const documentId = uuidv4();

    Object.assign(document, { documentId });

    await s3
        .putObject({
            Bucket: documentsBucket,
            Key: fileKey,
            Body: JSON.stringify(document),
        });
    const createEditorialRecordParams = {
        documentName: documentName,
        s3Location: `arn:aws:s3:::${documentsBucket}/${fileKey}`,
        informationType: params.informationType,
        contentSource: params.contentSource,
        statusId: config.dods.recordStatuses.created
    }

    const newRecord = await EditorialRecordRepository.defaultInstance.createEditorialRecord(createEditorialRecordParams);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Editorial Record created.',
        data: newRecord,
    });
};

export const createEditorialRecord: AsyncLambdaHandler<CreateEditorialRecordParameters | EditorialDocument> = async (params) => {

    if (isCreateEditorialRecordParameters(params)) {
        return createEditorialRecordV1(params);
    }

    return createEditorialRecordV2(params);
};
