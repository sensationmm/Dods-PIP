import { ClientAccount, ClientAccountDAO, ClientAccountPersister } from "../domain";
import { ClientAccountMariaDb } from "./ClientAccountMariaDb";

export class ClientAccountRepository implements ClientAccount {

    static defaultInstance: ClientAccount = new ClientAccountRepository(ClientAccountMariaDb.defaultInstance);

    constructor(private clientAccountPersister: ClientAccountPersister) { }

    async getClientAccount(clientAccountId: string): Promise<ClientAccountDAO[]> {

        return this.clientAccountPersister.getClientAccount(clientAccountId);
    }
}
