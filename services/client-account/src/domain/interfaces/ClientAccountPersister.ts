import {
    ClientAccountParameters,
    ClientAccountResponse,
    SearchClientAccountParameters,
    SearchClientAccountResponse,
    TeamMemberResponse,
    UpdateClientAccountHeaderParameters,
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

    getClientAccountTeam(
        clientAccountId: string
    ): Promise<TeamMemberResponse[]>;

    checkNameAvailability(name: string): Promise<boolean>;

    UpdateCompletion(
        clientAccountId: string,
        isCompleted: boolean,
        lastStepCompleted: number
    ): Promise<boolean>;

    updateClientAccountHeader(
        updateParameters: UpdateClientAccountHeaderParameters
    ): Promise<ClientAccountResponse | never[]>;

    checkSameName(name: string, clientAccountId: string): Promise<boolean>;
}
