import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Ajv from "ajv";
import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { putInS3 } from '../../utility/aws';
import { documentSchema } from '../../templates/';
import { config, CreateDocumentParameters, CreateDocumentParametersV2 } from '../../domain';

const ajv = new Ajv();
const validate = ajv.compile(documentSchema);

const { aws: { buckets: { content: contentBucket } } } = config;

export const isCreateDocumentParameters = (params: any): params is CreateDocumentParameters => 'document' in params;

export const createDocumentV1 = async (data: CreateDocumentParameters) => {
    // generate a name (documentId) for the file to be stored in S3
    const documentId = uuidv4();
    // get document payload
    const receivedDocument = data['document'];
    const parsedNewDocument = JSON.parse(receivedDocument);

    // validate received document schema
    const isValid = validate(parsedNewDocument)
    if (isValid) {
        const putParams: S3.PutObjectRequest = {
            Bucket: contentBucket,
            Key: documentId,
            Body: JSON.stringify(parsedNewDocument)
        }
        await putInS3(putParams)

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'New Document created.',
            data: {
                documentId,
                documentContent: parsedNewDocument
            }
        });
    } else {
        throw validate.errors;
    }
};

export const createDocumentV2 = async (params: CreateDocumentParametersV2) => {

    const { documentTitle, contentSource, informationType } = params;

    const documentId = uuidv4();

    const fileKey = `${contentSource}/${informationType}/${moment(new Date()).format('DD-MM-YYYY')}/${documentTitle}.json`;

    const putParams: S3.PutObjectRequest = {
        Bucket: contentBucket,
        Key: fileKey,
        Body: JSON.stringify(params),
    };

    await putInS3(putParams);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Document created.',
        data: {
            s3Location: `arn:aws:s3:::${contentBucket}/${fileKey}`,
            documentId,
            documentContent: params
        }
    });
};

export const createDocument: AsyncLambdaHandler<CreateDocumentParameters | CreateDocumentParametersV2> = async (params) => {
    if (isCreateDocumentParameters(params)) {
        return createDocumentV1(params);
    }

    return createDocumentV2(params);
};