import { LoginDynamodb } from "./LoginDynamodb";
import { hash, compare } from '../utility'
import { LoginEventBus } from "./LoginEventBus";
import { Login, PasswordUpdated, LoginPersister, LoginEventPublisher } from '../domain';

export class LoginRepository implements Login {

    static defaultInstance = new LoginRepository(LoginDynamodb.defaultInstance, LoginEventBus.defaultInstance);

    constructor(private loginPersister: LoginPersister, private loginEventPublisher: LoginEventPublisher) { }

    async getLastPassword(userName: string): Promise<string | undefined> {
        return await this.loginPersister.getLastPassword(userName);
    }

    async saveLastPassword(email: string, password: string): Promise<void> {

        const hashedPassword = hash(password);

        await this.loginPersister.saveLastPassword(email, hashedPassword);
    }

    async validateLastPassword(userName: string, password: string): Promise<boolean> {

        const lastPassword = await this.loginPersister.getLastPassword(userName);

        if (lastPassword && compare(password, lastPassword)) {
            return false;
        }

        return true;
    }

    async resetLoginAttempt(email: string): Promise<boolean> {
        return await this.loginPersister.resetLoginAttempt(email);
    }

    async incrementFailedLoginAttempt(email: string): Promise<number> {
        return await this.loginPersister.incrementFailedLoginAttempt(email);
    }

    async publishNewLogin(detail: PasswordUpdated): Promise<void> {
        await this.loginEventPublisher.publishNewLogin({ userName: detail.userName, lastPassword: detail.lastPassword });
    }

    async publishUpdatePassword(detail: PasswordUpdated): Promise<void> {
        await this.loginEventPublisher.publishUpdatePassword({ userName: detail.userName, lastPassword: detail.lastPassword });
    }
}