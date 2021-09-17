import { ClientAccountDAO } from "./ClientAccountDAO";

export interface ClientAccountPersister {
    getClientAccount(clientAccountId: string): Promise<Array<ClientAccountDAO>>;
}