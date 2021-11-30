import { ClientAccount } from "@dodsgroup/dods-model";
import { ClientAccountError } from "../domain";
import { ClientAccountInput, ClientAccountPersister } from "../domain/interfaces/ClientAccountPersister";

export class ClientAccountRepository implements ClientAccountPersister {

    static defaultInstance: ClientAccountPersister = new ClientAccountRepository();

    async findOne(parameters: ClientAccountInput): Promise<ClientAccount> {

        const { uuid } = parameters;

        const result = await ClientAccount.findOne({ where: { uuid } });

        if (!result) {
            throw new ClientAccountError(`Error: ClientAccountUUID ${uuid} does not exist`);
        }

        return result;
    }
}