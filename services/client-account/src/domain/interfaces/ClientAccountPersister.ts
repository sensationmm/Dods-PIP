import { ClientAccount, ClientAccountResponse, SearchClientAccountParameters, SearchClientAccountResponse } from '.';

export interface ClientAccountPersister {
    createClientAccount(clientAccount: ClientAccount): Promise<ClientAccountResponse>;
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
    searchClientAccount(clientAccount: SearchClientAccountParameters): Promise<Array<SearchClientAccountResponse>>;
}
