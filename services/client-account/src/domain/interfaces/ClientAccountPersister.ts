import { ClientAccountParameters, ClientAccountResponse, SearchClientAccountParameters, SearchClientAccountResponse } from '.';

export interface ClientAccountPersister {
    createClientAccount(
        clientAccount: ClientAccountParameters
    ): Promise<ClientAccountResponse>;
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
    searchClientAccount(clientAccount: SearchClientAccountParameters): Promise<Array<SearchClientAccountResponse>>;
    getClientAccountSeats(clientAccountId: string): Promise<number>;
    getClientAccountUsers(clientAccountId: string): Promise<any>;
}
