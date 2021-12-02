import { ClientAccountInput, ClientAccountOutput } from "@dodsgroup/dods-model";

export interface ClientAccountPersisterV2 {
    findOne(where: Partial<ClientAccountInput>): Promise<ClientAccountOutput>;
}