import { ClientAccountInput, ClientAccountOutput } from "@dodsgroup/dods-model";

export interface ClientAccountPersisterV2 {
    updateClientAccount(values: Partial<ClientAccountInput>, where: Partial<ClientAccountInput>): Promise<void>;
    findOne(where: Partial<ClientAccountInput>): Promise<ClientAccountOutput>;
    incrementSubscriptionSeat(where: Partial<ClientAccountInput>): Promise<ClientAccountOutput>;
}