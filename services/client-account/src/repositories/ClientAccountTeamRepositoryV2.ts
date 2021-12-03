import { ClientAccountTeam, ClientAccountTeamInput, ClientAccountTeamOutput } from '@dodsgroup/dods-model';
import { ClientAccountTeamPersisterV2 } from '../domain/interfaces/ClientAccountTeamPersister';

export class ClientAccountTeamRepositoryV2 implements ClientAccountTeamPersisterV2 {
    static defaultInstance: ClientAccountTeamPersisterV2 = new ClientAccountTeamRepositoryV2(ClientAccountTeam);

    constructor(private model: typeof ClientAccountTeam) { }

    async create(data: ClientAccountTeamInput): Promise<ClientAccountTeamOutput> {

        const newClientAccount = await this.model.create(data);

        return newClientAccount;
    }

    async findOne(where: Partial<ClientAccountTeamInput>): Promise<ClientAccountTeamOutput> {
        const clientAccountTeam = await this.model.findOne({ where, include: [this.model.associations.users, this.model.associations.clientAccounts], });

        if (clientAccountTeam) {
            return clientAccountTeam;
        } else {
            throw new Error('Error: clientAccountTeam not found');
        }
    }

    async delete(where: Partial<ClientAccountTeamInput>): Promise<void> {
        await this.model.destroy({ where });
    }
}
