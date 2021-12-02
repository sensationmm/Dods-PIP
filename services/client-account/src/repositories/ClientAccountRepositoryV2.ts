import {
    ClientAccount,
    ClientAccountInput,
    ClientAccountOutput,
} from '@dodsgroup/dods-model';

import { ClientAccountPersisterV2 } from '../domain';

export class ClientAccountRepositoryV2 implements ClientAccountPersisterV2 {
    static defaultInstance: ClientAccountPersisterV2 =
        new ClientAccountRepositoryV2();

    async findOne(
        where: Partial<ClientAccountInput>
    ): Promise<ClientAccountOutput> {
        const clientAccountModel = await ClientAccount.findOne({
            where,
            include: [
                //ClientAccount.associations.salesContactUser,
                ClientAccount.associations.subscriptionType,
            ],
        });

        if (clientAccountModel) {
            return clientAccountModel;
        } else {
            throw new Error('Error: clientAccount not found');
        }
    }
}
