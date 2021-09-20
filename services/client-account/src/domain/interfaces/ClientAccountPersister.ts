import { ClientAccountParameters, ClientAccountResponse, SubscriptionTypeResponse } from '.';

export interface ClientAccountPersister {
    createClientAccount(clientAccount: ClientAccountParameters): Promise<ClientAccountResponse>;
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
    getSubscriptionTypes(): Promise<Array<SubscriptionTypeResponse>>;
}
