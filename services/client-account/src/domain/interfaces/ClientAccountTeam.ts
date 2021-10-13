export interface ClientAccountTeam {
    clientAccountId: number;
    userId?: number;
    teamMemberType: number;
}

export interface ClientAccountTeamParameters {
    clientAccountTeam: ClientAccountTeam;
}