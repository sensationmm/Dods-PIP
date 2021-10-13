import { LoginEventPublisher } from "./LoginEventPublisher";
import { LoginAttemptsPersister } from "./LoginAttemptsPersister";
import { LoginLastPasswordsPersister } from "./LoginLastPasswordsPersister";

export interface Login extends LoginAttemptsPersister, LoginLastPasswordsPersister, LoginEventPublisher {
    validateLastPassword(userName: string, password: string): Promise<boolean>;
}