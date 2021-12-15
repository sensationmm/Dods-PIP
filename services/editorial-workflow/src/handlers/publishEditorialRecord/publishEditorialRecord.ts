import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
//import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
//import { Lambda } from 'aws-sdk';
import { Lambda, S3 } from 'aws-sdk';

import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';

export const publishEditorialRecord: AsyncLambdaHandler<{ recordId: string }> = async ({
    recordId,
}) => {
    const region = process.env.AWS_REGION
    const lambdaClient = new Lambda({ region: region });
    const s3Client = new S3({ region: region });

    const editorialRecord = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);

    const documentARN = editorialRecord.s3Location;

    const keyName = documentARN.substring(documentARN.indexOf("/") + 1, documentARN.length);

    const getFileParams = {
        Bucket: 'dods-dev-editorial-record-documents',
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

    // lambda content indexing invokation

    const lambdaReponse = await lambdaClient.invoke({ FunctionName: 'content-indexer-dev', Payload: documentContent }, function (error, data) {
        if (error) {
            console.log(error);
        }
        if (data) {
            console.log(data);
        }
    }).promise();

    if (!bucketErr && lambdaReponse.Payload === 'true') {
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'ARN Bucket',
            data: documentARN,
        });
    }

    else {


        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: errorCode,

        });

    }

};
