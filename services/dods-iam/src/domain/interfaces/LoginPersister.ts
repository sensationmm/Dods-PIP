export interface LoginPersister {
    saveLastPassword(userName: string, password: string): Promise<void>;
    getLastPassword(userName: string): Promise<string | undefined>;
    incrementFailedLoginAttempt(userName: string): Promise<number>;
    resetLoginAttempt(userName: string): Promise<boolean>;
}