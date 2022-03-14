import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { AwsService, CreateEditorialRecordParameters, DefaultAwsService, EditorialRecordRepository } from '@dodsgroup/dods-repositories';
import { EditorialDocument, config, } from '../../domain';

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const { aws: { region, buckets: { documents: documentsBucket } } } = config;
const awsService: AwsService = new DefaultAwsService(region);

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
        jurisdiction: params.jurisdiction ?? 'UK',
        sourceReferenceFormat: 'text/html',
        internallyCreated: true,
        schemaType: 'Internal',
        contentDateTime: params.contentDateTime ? new Date(params.contentDateTime) : new Date(),
        createdDateTime: new Date(),
        ingestedDateTime: new Date(),
        version: '1.0',
        language: 'en',
        originalContent: '',
        originator: params.originator ? params.originator : null
    }
    if (!params.taxonomyTerms) {
        params.taxonomyTerms = [];
    }

    const documentName: any = params.documentTitle;
    const documentFileName = documentName.replace(/[\/\\#, |+()$~%.'":*!?<>{}^`.@=;+\[\]]/g, '_')

    const { contentSource, informationType, createdDateTime } = params as EditorialDocument;
    const arnFileName = documentFileName.substring(0, 99);

    const fileKey = `${contentSource}/${informationType}/${moment(createdDateTime).format('DD-MM-YYYY')}/${arnFileName}.json`;

    const document = params;
    const documentId = uuidv4();

    Object.assign(document, { documentId });

    await awsService.putInS3(documentsBucket, fileKey, document);

    const createEditorialRecordParams = {
        documentName: documentName,
        s3Location: `arn:aws:s3:::${documentsBucket}/${fileKey}`,
        informationType: params.informationType,
        contentSource: params.contentSource,
        statusId: config.dods.recordStatuses.created
    }

    const newRecord: any = await EditorialRecordRepository.defaultInstance.createEditorialRecord(createEditorialRecordParams);

    let { s3Location, ...recordResponse } = newRecord;

    recordResponse = { ...recordResponse, contentDateTime: params.contentDateTime }

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Editorial Record created.',
        data: recordResponse,
    });
};

export const createEditorialRecord: AsyncLambdaHandler<CreateEditorialRecordParameters | EditorialDocument> = async (params) => {

    if (isCreateEditorialRecordParameters(params)) {
        return createEditorialRecordV1(params);
    }

    return createEditorialRecordV2(params);
};
