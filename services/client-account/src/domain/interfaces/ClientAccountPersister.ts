import { GetClientAccountParameters, ClientAccountResponse } from '.';

export interface ClientAccountPersister {
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
}
