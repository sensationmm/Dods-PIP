export interface LoginAttemptsPersister {
    incrementFailedLoginAttempt(userName: string): Promise<number>;
    resetLoginAttempt(userName: string): Promise<boolean>;
}