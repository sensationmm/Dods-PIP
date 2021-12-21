import { DocumentPublishPersister } from '../domain/interfaces/DocumentPublishPersister';
import { Lambda } from 'aws-sdk';

export class DocumentPublishRepository implements DocumentPublishPersister {

    static defaultInstance: DocumentPublishRepository = new DocumentPublishRepository();

    constructor() { }


    async publishDocument(lambdaName: string, payload: string): Promise<boolean> {

        const lambdaClient = new Lambda({ region: process.env.AWS_REGION });

        const lambdaReponse = await lambdaClient.invoke({ FunctionName: lambdaName, Payload: payload }, function (error, data) {
            if (error) {
                console.log(error);

            }
            if (data) {
                console.log(data);
            }
        }).promise();

        if (lambdaReponse.Payload === 'true') {
            return true
        }

        else {
            return false
        }

    }


}


