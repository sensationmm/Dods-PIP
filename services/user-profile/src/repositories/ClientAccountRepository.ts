import { ClientAccount, ClientAccountInput, ClientAccountOutput } from "@dodsgroup/dods-model";
import { ClientAccountError, ClientAccountPersister } from "../domain";

export class ClientAccountRepository implements ClientAccountPersister {

    static defaultInstance: ClientAccountPersister = new ClientAccountRepository(ClientAccount);

    constructor(private model: typeof ClientAccount) { }

    async findOne(where: Partial<ClientAccountInput>): Promise<ClientAccountOutput> {

        const result = await this.model.findOne({ where, });

        if (!result) {
            throw new ClientAccountError(`Error: ClientAccount with ${JSON.stringify(where)} does not exist`);
        }

        return result;
    }
}