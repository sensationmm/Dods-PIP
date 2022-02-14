import { CollectionRepository } from "../../repositories/CollectionRepository";
import { DeleteMessageBatchRequest } from 'aws-sdk/clients/sqs';
import { SQS } from 'aws-sdk';
import { SQSEvent } from 'aws-lambda/trigger/sqs';
import { config } from '../../domain';

const sqsClient = new SQS();


const { dods: { downstreamEndpoints: { apiGatewayBaseURL, sqsURL } } } = config;

export const handle = async (event: SQSEvent) => {

    const messagesBody = event.Records.map((record) => {
        const message: Object = JSON.parse(record.body);
        return {
            ...message,
            id: record.messageId,
            receiptHandle: record.receiptHandle,
        }
    })

    const message = messagesBody[0]

    const messageParameters: any = {
        ...message,
        baseURL: apiGatewayBaseURL
    }

    await CollectionRepository.defaultInstance.processImmediateAlert(messageParameters)

    const deleteParams: DeleteMessageBatchRequest = {
        QueueUrl: sqsURL,
        Entries: [{ Id: message.id, ReceiptHandle: message.receiptHandle }]
    }

    await sqsClient.deleteMessageBatch(deleteParams)

}