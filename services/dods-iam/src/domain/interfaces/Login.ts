import { LoginEventPublisher } from "./LoginEventPublisher";
import { LoginPersister } from "./LoginPersister";

export interface Login extends LoginPersister, LoginEventPublisher {
    validateLastPassword(userName: string, password: string): Promise<boolean>;
}