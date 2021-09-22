import { ClientAccountParameters, ClientAccountResponse, SearchClientAccountParameters } from '.';

export interface ClientAccountPersister {
    createClientAccount(
        clientAccount: ClientAccountParameters
    ): Promise<ClientAccountResponse>;
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
    searchClientAccount(clientAccount: SearchClientAccountParameters): Promise<Array<ClientAccountResponse>>;
}
