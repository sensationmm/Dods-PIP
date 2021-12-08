import { ClientAccountTeamInput, ClientAccountTeamOutput } from "@dodsgroup/dods-model";
import { ClientAccountTeam } from "./ClientAccountTeam";

export interface ClientAccountTeamPersisterV2 {
    create(data: ClientAccountTeamInput): Promise<ClientAccountTeamOutput>;
    findOne(where: Partial<ClientAccountTeamInput>): Promise<ClientAccountTeamOutput>;
    delete(where: Partial<ClientAccountTeamInput>): Promise<void>;
}

export interface ClientAccountTeamPersister {
    create(data: ClientAccountTeam): Promise<ClientAccountTeam>;
}