import { PasswordUpdated } from "../event";

export interface LoginEventPublisher {
    publishNewLogin(detail: PasswordUpdated): Promise<void>;
    publishUpdatePassword(detail: PasswordUpdated): Promise<void>;
}