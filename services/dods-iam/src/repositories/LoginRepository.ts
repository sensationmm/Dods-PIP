import { LoginAttemptsDynamodb } from "./LoginAttemptsDynamodb";
import { LoginLastPasswordsDynamodb } from "./LoginLastPasswordsDynamodb";
import { hash, compare } from '../utility'
import { LoginEventBus } from "./LoginEventBus";
import { Login, PasswordUpdated, LoginAttemptsPersister, LoginLastPasswordsPersister, LoginEventPublisher } from '../domain';

export class LoginRepository implements Login {

    static defaultInstance = new LoginRepository(LoginAttemptsDynamodb.defaultInstance, LoginLastPasswordsDynamodb.defaultInstance, LoginEventBus.defaultInstance);

    constructor(private loginAttemptsPersister: LoginAttemptsPersister, private loginLastPasswordsPersister: LoginLastPasswordsPersister, private loginEventPublisher: LoginEventPublisher) { }

    async getLastPasswords(userName: string): Promise<string[]> {
        return await this.loginLastPasswordsPersister.getLastPasswords(userName);
    }

    async saveLastPassword(email: string, password: string): Promise<void> {

        const hashedPassword = hash(password);

        await this.loginLastPasswordsPersister.saveLastPassword(email, hashedPassword);
    }

    async validateLastPassword(userName: string, password: string): Promise<boolean> {

        const lastPasswords = await this.loginLastPasswordsPersister.getLastPasswords(userName);

        const result = !lastPasswords.some(lastPassword => compare(password, lastPassword))

        return result;
    }

    async resetLoginAttempt(email: string): Promise<boolean> {
        return await this.loginAttemptsPersister.resetLoginAttempt(email);
    }

    async incrementFailedLoginAttempt(email: string): Promise<number> {
        return await this.loginAttemptsPersister.incrementFailedLoginAttempt(email);
    }

    async publishNewLogin(detail: PasswordUpdated): Promise<void> {
        await this.loginEventPublisher.publishNewLogin({ userName: detail.userName, lastPassword: detail.lastPassword });
    }

    async publishUpdatePassword(detail: PasswordUpdated): Promise<void> {
        await this.loginEventPublisher.publishUpdatePassword({ userName: detail.userName, lastPassword: detail.lastPassword });
    }
}