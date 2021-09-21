import { EventBridgeEvent } from 'aws-lambda';
import { AsyncLambdaMiddleware } from "nut-pipe";
import { Logger } from '../utility';

export const eventLogerMiddleware: AsyncLambdaMiddleware<EventBridgeEvent<string, any>> = async (event, context, callback, next) => {

    Logger.info(`EventLogerMiddleware Entry`, { source: event.source, detailType: event['detail-type'] });

    await next(event, context);

};
