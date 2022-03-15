import { DocumentPayloadResponse, DocumentStoragePersister } from '../domain/interfaces/DocumentStoragePersister';
import { Lambda, S3 } from 'aws-sdk';

export class DocumentStorageRepository implements DocumentStoragePersister {

    static defaultInstance: DocumentStorageRepository = new DocumentStorageRepository();

    constructor() { }


    async getDocumentByArn(documentARN: string): Promise<DocumentPayloadResponse> {

        let response: DocumentPayloadResponse = { success: undefined, payload: undefined }


        const region = process.env.AWS_REGION
        const s3Client = new S3({ region: region });
        const keyName = documentARN.substring(documentARN.indexOf("/") + 1, documentARN.length);
        const bucket = documentARN.substring(documentARN.lastIndexOf(":") + 1, documentARN.indexOf("/"))
        const getFileParams = {
            Bucket: bucket,
            Key: keyName
        }

        let bucketErr = false;
        let errorCode;

        const content = await s3Client.getObject(getFileParams, function (err) {

            if (err) {
                errorCode = err.code;
                bucketErr = true;
            }

        }).promise();

        const documentContent = content.Body?.toString('utf-8');

        if (!bucketErr) {

            response = {
                success: true,
                payload: documentContent
            }
        }

        else {

            response = {
                success: false,
                payload: errorCode
            }
        }

        return response;

    }

    async updateDocumemt(documentARN: string, payload: string): Promise<Boolean> {

        let success = true;

        const region = process.env.AWS_REGION
        const s3Client = new S3({ region: region });
        const keyName = documentARN.substring(documentARN.indexOf("/") + 1, documentARN.length);
        const bucket = documentARN.substring(documentARN.lastIndexOf(":") + 1, documentARN.indexOf("/"))
        const updateFileParams = {
            Bucket: bucket,
            Key: keyName,
            Body: JSON.stringify(payload),
        }


        await s3Client.putObject(updateFileParams, function (err) {
            if (err) {
                success = false
            }
        }).promise();

        return success;

    }

    async autoTagContent(lambdaName: string, payload: string): Promise<Object> {

        const lambdaClient = new Lambda({ region: process.env.AWS_REGION });

        const lambdaResponse = await lambdaClient.invoke({ FunctionName: lambdaName, Payload: payload }, function (error, data) {
            if (error) {
                console.log(error);
            }
            if (data) {
                console.log(data);
            }
        }).promise();
        return lambdaResponse;

    }


}


