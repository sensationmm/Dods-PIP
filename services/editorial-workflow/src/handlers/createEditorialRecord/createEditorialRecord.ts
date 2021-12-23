import { S3 } from '@aws-sdk/client-s3';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { config, CreateEditorialRecordParameters, CreateEditorialRecordParametersV2, } from '../../domain';
import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';

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

export const createEditorialRecordV2 = async (params: CreateEditorialRecordParametersV2) => {
    const { documentName, contentSource, informationType, document, document: { createdDateTime } } = params as CreateEditorialRecordParametersV2;

    const fileKey = `${contentSource}/${informationType}/${moment(createdDateTime).format('DD-MM-YYYY')}/${documentName}.json`;

    const documentId = uuidv4();

    Object.assign(document, { documentId });

    await s3
        .putObject({
            Bucket: documentsBucket,
            Key: fileKey,
            Body: JSON.stringify(document),
        });

    const newRecord = await EditorialRecordRepository.defaultInstance.createEditorialRecord({ ...params, s3Location: `arn:aws:s3:::${documentsBucket}/${fileKey}`, statusId: config.dods.recordStatuses.created });

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Editorial Record created.',
        data: newRecord,
    });
};

export const createEditorialRecord: AsyncLambdaHandler<CreateEditorialRecordParameters | CreateEditorialRecordParametersV2> = async (params) => {

    if (isCreateEditorialRecordParameters(params)) {
        return createEditorialRecordV1(params);
    }

    return createEditorialRecordV2(params);
};
