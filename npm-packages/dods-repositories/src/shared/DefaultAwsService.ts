import { TextDecoder } from "util";
import { Lambda } from '@aws-sdk/client-lambda';
import { S3 } from '@aws-sdk/client-s3';

const { AWS_REGION, NODE_ENV, _endpoint = NODE_ENV === 'development' ? 'http://localhost:3002' : undefined } = process.env;

export interface AwsService {
    invokeLambda<TResult>(lambdaName: string, payload: any, defaultResponse: TResult): Promise<TResult>;
    getFromS3(bucket: string, keyName: string): Promise<string | Error>;
    putInS3(bucket: string, keyName: string, body: any): Promise<boolean | Error>;
}

export class DefaultAwsService implements AwsService {

    static defaultInstance: AwsService = new DefaultAwsService();

    lambdaClient: Lambda;
    s3Client: S3;

    constructor(region: string = AWS_REGION!, endpoint: string = _endpoint!) {
        const awsOptions = { endpoint, region };
        this.lambdaClient = new Lambda(awsOptions);
        this.s3Client = new S3(awsOptions);
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

    async getFromS3(bucket: string, keyName: string): Promise<string | Error> {
        try {
            const content = await this.s3Client.getObject({ Bucket: bucket, Key: keyName });

            const documentContent = content.Body?.toString('utf-8');

            return documentContent;
        } catch (error: any) {
            return error;
        }
    }

    async putInS3(bucket: string, keyName: string, body: any): Promise<boolean | Error> {
        try {
            const bodyString = typeof body === 'string' ? body : JSON.stringify(body);

            await this.s3Client.putObject({ Bucket: bucket, Key: keyName, Body: bodyString });
        } catch (error: any) {
            return error;
        }

        return true;
    }
}
