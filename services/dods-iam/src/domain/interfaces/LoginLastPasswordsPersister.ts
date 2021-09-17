export interface LoginLastPasswordsPersister {
    saveLastPassword(userName: string, password: string): Promise<void>;
    getLastPasswords(userName: string): Promise<Array<string>>;
}