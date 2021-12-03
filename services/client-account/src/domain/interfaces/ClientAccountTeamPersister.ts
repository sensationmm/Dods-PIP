import { ClientAccountTeamInput, ClientAccountTeamOutput } from "@dodsgroup/dods-model";

export interface ClientAccountTeamPersister {
    create(data: ClientAccountTeamInput): Promise<ClientAccountTeamOutput>;
    findOne(where: Partial<ClientAccountTeamInput>): Promise<ClientAccountTeamOutput>;
    delete(where: Partial<ClientAccountTeamInput>): Promise<void>;
}
