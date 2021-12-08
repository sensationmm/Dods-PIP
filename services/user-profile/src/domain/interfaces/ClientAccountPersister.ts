import { ClientAccountInput, ClientAccountOutput } from "@dodsgroup/dods-model";

export interface ClientAccountPersister {
    findOne(parameters: Partial<ClientAccountInput>): Promise<ClientAccountOutput>;
}