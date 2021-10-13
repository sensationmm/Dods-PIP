import { ClientAccountTeam } from "./ClientAccountTeam";


export interface ClientAccountTeamPersister {
    create(data: ClientAccountTeam): Promise<ClientAccountTeam>;
}
