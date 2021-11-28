import { ClientAccount } from "@dodsgroup/dods-model";

export type ClientAccountInput = { uuid: string; }

export type ClientAccountOutput = ClientAccount;

export interface ClientAccountPersister {
    findOne(parameters: ClientAccountInput): Promise<ClientAccountOutput>;
}