export type DestroyUserInput = { email: string; };

export interface IamPersister {
    destroyUser(where: DestroyUserInput): Promise<void>;
}
