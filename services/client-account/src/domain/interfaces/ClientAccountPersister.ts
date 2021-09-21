import { ClientAccountParameters, ClientAccountResponse } from '.';
export interface ClientAccountPersister {
    createClientAccount(
        clientAccount: ClientAccountParameters
    ): Promise<ClientAccountResponse>;
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
}
