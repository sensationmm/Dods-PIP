import { EventBus } from "../utility";
import { config, EventSources, LoginEventDetailTypes, LoginEventPublisher, PasswordUpdated } from "../domain";

const defaultLoginEventBusName = config.aws.resources.loginEventBusName;

export class LoginEventBus implements LoginEventPublisher {

    static defaultInstance = new LoginEventBus(defaultLoginEventBusName, EventBus.defaultInstance);

    constructor(private eventBusName: string, private eventBus: EventBus) { }

    async publishNewLogin(detail: PasswordUpdated): Promise<void> {
        await this.eventBus.putEvent({
            EventBusName: this.eventBusName,
            Source: EventSources.Login,
            DetailType: LoginEventDetailTypes.NewUserCreated,
            Detail: detail
        });
    }

    async publishUpdatePassword(detail: PasswordUpdated): Promise<void> {
        await this.eventBus.putEvent({
            EventBusName: this.eventBusName,
            Source: EventSources.Login,
            DetailType: LoginEventDetailTypes.PasswordUpdated,
            Detail: detail
        });
    }
}