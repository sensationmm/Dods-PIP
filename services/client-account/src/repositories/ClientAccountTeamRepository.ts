import ClientAccountTeamModel from '../db/models/ClientAccountTeamModel';
import { ClientAccountTeam } from '../domain/interfaces/ClientAccountTeam';
import { ClientAccountTeamPersister } from '../domain/interfaces/ClientAccountTeamPersister';

export class ClientAccountTeamRepository implements ClientAccountTeamPersister {
    static defaultInstance: ClientAccountTeamPersister = new ClientAccountTeamRepository(ClientAccountTeamModel);

    constructor(private model: typeof ClientAccountTeamModel) { }

    async create(data: ClientAccountTeam): Promise<ClientAccountTeam> {
        if (!data) {
            throw new Error('Error: clientAccount cannot be empty');
        }

        const newClientAccount = await this.model.create(data);

        // const newClientAccount = parseResponseFromModel(newClientAccountModel);

        return newClientAccount;
    }
}
