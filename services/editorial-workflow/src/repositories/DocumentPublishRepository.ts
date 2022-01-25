import {
    ScheduleEditorialRecordParamateres,
    ScheduleWebhookParameters,
    config
} from '../domain';

import { DocumentPublishPersister } from '../domain/interfaces/DocumentPublishPersister';
import { Lambda } from 'aws-sdk';
import axios from 'axios';

const { dods: { downstreamEndpoints: { userProfile } } } = config;
export class DocumentPublishRepository implements DocumentPublishPersister {

    static defaultInstance: DocumentPublishRepository = new DocumentPublishRepository();

    constructor(private baseURL: string = userProfile) { }


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

    async scheduleWebhook(parameters: ScheduleEditorialRecordParamateres): Promise<object> {
        const scheduleWebhook: ScheduleWebhookParameters = { ...parameters, scheduleType: 'publish', scheduleId: parameters.recordId }
        const response = await axios.post(`${this.baseURL}/scheduler`, scheduleWebhook);
        return { response };
    }


}


