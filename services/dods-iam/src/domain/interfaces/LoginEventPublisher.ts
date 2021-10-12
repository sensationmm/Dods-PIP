import { PasswordUpdated } from ".";

export interface LoginEventPublisher {
    publishNewLogin(detail: PasswordUpdated): Promise<void>;
    publishUpdatePassword(detail: PasswordUpdated): Promise<void>;
}