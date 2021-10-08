import {
    ClientAccountParameters,
    ClientAccountResponse,
    SearchClientAccountParameters,
    SearchClientAccountResponse,
    UpdateClientAccountParameters,
} from '.';

export interface ClientAccountPersister {
    createClientAccount(
        clientAccount: ClientAccountParameters
    ): Promise<ClientAccountResponse | undefined>;
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
    findOne(where: Record<string, any>): Promise<ClientAccountResponse>;

    searchClientAccount(
        clientAccount: SearchClientAccountParameters
    ): Promise<Array<SearchClientAccountResponse> | undefined>;

    updateClientAccount(
        updateParameters: UpdateClientAccountParameters
    ): Promise<ClientAccountResponse | never[]>;

    getClientAccountSeats(clientAccountId: string): Promise<number>;

    getClientAccountUsers(clientAccountId: string): Promise<number>;

    checkNameAvailability(name: string): Promise<boolean>;
    lastStepUpdate(clientAccountId: string): Promise<boolean>;
}
