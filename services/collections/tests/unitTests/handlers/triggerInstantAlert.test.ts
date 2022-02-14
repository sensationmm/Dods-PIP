import { CollectionRepository } from '../../../src/repositories/CollectionRepository';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { config } from '../../../src/domain';
import { handle } from '../../../src/handlers/triggerInstantAlert/index';
import { mocked } from 'jest-mock';
const FUNCTION_NAME = handle.name;

jest.mock('../../../src/repositories/CollectionRepository');
const mockedCollectionRepository = mocked(CollectionRepository, true);

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;

describe(`${FUNCTION_NAME} handler`, () => {

    it('Valid Input', async () => {

        const params = {
            documentId: '350b159c-6e43-11ec-90d6-0242ac120003',
            alertId: '9648fe0-534b-4b3b-9214-6bf57b0cdd56'
        }

        const event = {
            Records: [{
                messageId: 'messageUUID',
                body: JSON.stringify(params),
                receiptHandle: 'TOKEN'
            }]
        } as SQSEvent;

        await handle(event);


        expect(mockedCollectionRepository.defaultInstance.processImmediateAlert).toHaveBeenCalledWith({
            ...params,
            baseURL: apiGatewayBaseURL,
            id: event.Records[0].messageId,
            receiptHandle: event.Records[0].receiptHandle
        });
    });
});
