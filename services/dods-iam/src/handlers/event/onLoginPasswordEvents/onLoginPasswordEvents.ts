import { EventBridgeEvent } from "aws-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { PasswordUpdated } from "../../../domain";
import { LoginRepository } from '../../../repositories';

export const onLoginPasswordEvents: AsyncLambdaMiddleware<EventBridgeEvent<string, PasswordUpdated>> = async (event) => {


    await LoginRepository.defaultInstance.saveLastPassword(event.detail.userName, event.detail.lastPassword);
};