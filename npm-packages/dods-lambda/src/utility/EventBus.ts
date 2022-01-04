import { EventBridge } from "aws-sdk";
import { PutEventsRequest } from "aws-sdk/clients/eventbridge";
import { EventBridgeError } from "@dodsgroup/dods-domain";
import { Logger } from ".";

const defaultEventBridge = new EventBridge();

export interface PutEventRequest<TDetail> {
    EventBusName: string;
    Source: string;
    DetailType: string;
    Detail: TDetail;
}

export class EventBus {

    static defaultInstance = new EventBus(defaultEventBridge);

    constructor(private eventBus: EventBridge) { }

    async putEvent<TDetail>(event: PutEventRequest<TDetail>) {

        try {
            const params: PutEventsRequest = {
                Entries: [
                    {
                        EventBusName: event.EventBusName,
                        Source: event.Source,
                        DetailType: event.DetailType,
                        Detail: JSON.stringify(event.Detail)
                    },
                ],
            };

            const res = await this.eventBus.putEvents(params).promise();

            let eventId = '';

            if (!res.Entries) {
                throw new EventBridgeError('PutEventsResultEntryList is undefined')
            }

            if (res.FailedEntryCount && res.FailedEntryCount > 0) {
                const errors: string[] = res.Entries.filter((e) => e.ErrorCode && e.ErrorMessage).map(
                    (e) => `Event ID: ${e.EventId}, Error Code: ${e.ErrorCode}, Message: ${e.ErrorMessage}`,
                );

                throw new EventBridgeError(errors.join('|'));
            }

            Logger.info('eventbridge: put', { source: event.Source, detailType: event.DetailType, count: 1, eventId })
        } catch (error: any) {
            Logger.error('eventbridge: failed to put', error)
            throw error
        }
    }
}
