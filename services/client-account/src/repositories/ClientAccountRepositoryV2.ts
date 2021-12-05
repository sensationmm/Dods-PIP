import { ClientAccount, ClientAccountInput, ClientAccountOutput, } from '@dodsgroup/dods-model';
import { ClientAccountError, ClientAccountPersisterV2 } from '../domain';

export class ClientAccountRepositoryV2 implements ClientAccountPersisterV2 {
    static defaultInstance: ClientAccountPersisterV2 = new ClientAccountRepositoryV2(ClientAccount);

    constructor(private model: typeof ClientAccount) { }

    async findOne(where: Partial<ClientAccountInput>): Promise<ClientAccountOutput> {
        const result = await this.model.findOne({
            where,
            include: [
                //ClientAccount.associations.salesContactUser,
                ClientAccount.associations.subscriptionType,
            ],
        });

        if (!result) {
            throw new ClientAccountError(`Error: ClientAccount with ${JSON.stringify(where)} does not exist`);
        }
        return result;
    }

    async incrementSubscriptionSeats(where: Partial<ClientAccountInput>): Promise<ClientAccountOutput> {
        return await this.model.increment('subscriptionSeats', { where });
    }
}
