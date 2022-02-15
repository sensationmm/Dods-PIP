import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { Lambda } from '@aws-sdk/client-lambda';
import { TextDecoder } from "util";

const { AWS_REGION, NODE_ENV, _endpoint = NODE_ENV === 'development' ? 'http://localhost:3002' : undefined } = process.env;

export interface AwsService {
    invokeLambda<TResult>(lambdaName: string, payload: any, defaultResponse: TResult): Promise<TResult>;
    getFromS3(bucket: string, keyName: string): Promise<string | Error>;
    putInS3(bucket: string, keyName: string, body: any): Promise<boolean | Error>;
}

export class DefaultAwsService implements AwsService {

    static defaultInstance: AwsService = new DefaultAwsService();

    lambdaClient: Lambda;
    s3Client: S3Client;

    constructor(region: string = AWS_REGION!, endpoint: string = _endpoint!) {
        this.lambdaClient = new Lambda({ endpoint, region });
        this.s3Client = new S3Client({ region });
    }

    async invokeLambda<TResult>(lambdaName: string, payload: any, defaultResponse: TResult) {

        const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);

        const lambdaReponse = await this.lambdaClient.invoke({ FunctionName: lambdaName, Payload: Buffer.from(payloadString) });

        if (lambdaReponse.FunctionError) {
            throw new Error(lambdaReponse.FunctionError);
        }

        const response = JSON.parse(new TextDecoder('utf-8').decode(lambdaReponse.Payload)) || defaultResponse as TResult;

        return response;
    }

    async getFromS3(Bucket: string, Key: string): Promise<string | Error> {
        try {
            const content = await this.s3Client.send(new GetObjectCommand({ Bucket, Key }));

            const documentContent = content.Body?.toString('utf-8');

            return documentContent;
        } catch (error: any) {
            return error;
        }
    }

    async putInS3(Bucket: string, Key: string, body: any): Promise<boolean | Error> {
        try {
            const Body = typeof body === 'string' ? body : JSON.stringify(body);
            console.log('In S3 Bucket------>');
            console.log(Body);
            const responseBucket = await this.s3Client.send(new PutObjectCommand({ Bucket, Key, Body }));
            console.log(responseBucket);
        } catch (error: any) {
            return error;
        }
        return true;
    }
}
