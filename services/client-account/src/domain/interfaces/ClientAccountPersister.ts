import { ClientAccountModel, ClientAccountModelAttributes } from '../../db';
import {
    ClientAccountParameters,
    ClientAccountResponse,
    SearchClientAccountParameters,
    SearchClientAccountTotalRecords,
    TeamMemberResponse,
    UpdateClientAccountHeaderParameters,
    UpdateClientAccountParameters,
} from '.';

export interface ClientAccountPersister {
    createClientAccount(
        clientAccount: ClientAccountParameters
    ): Promise<ClientAccountResponse | undefined>;
    getClientAccount(clientAccountId: string): Promise<ClientAccountResponse>;
    findOne(
        where: Partial<ClientAccountModelAttributes>
    ): Promise<ClientAccountModel>;

    searchClientAccount(
        clientAccount: SearchClientAccountParameters
    ): Promise<SearchClientAccountTotalRecords | undefined>;

    updateClientAccount(
        updateParameters: UpdateClientAccountParameters
    ): Promise<ClientAccountResponse | never[]>;

    addTeamMember(params: {
        clientAccountId: string;
        userId: string;
        teamMemberType: number;
    }): Promise<TeamMemberResponse[]>;

    getClientAccountSeats(clientAccountId: string): Promise<number>;

    getClientAccountUsers(clientAccountUuid: string): Promise<number>;

    getClientAccountAvailableSeats(clientAccountId: string): Promise<number>;

    getClientAccountTeam(
        clientAccountId: string
    ): Promise<TeamMemberResponse[]>;

    checkNameAvailability(name: string): Promise<boolean>;

    UpdateCompletion(
        clientAccountUuid: string,
        isCompleted: boolean,
        lastStepCompleted: number
    ): Promise<boolean>;

    updateClientAccountHeader(
        updateParameters: UpdateClientAccountHeaderParameters
    ): Promise<ClientAccountResponse | never[]>;

    checkSameName(name: string, clientAccountId: string): Promise<boolean>;

    deleteClientAccountTeamMembers(clientAccountId: string): Promise<boolean>;
}
