export interface ClientAccountTeam {
    clientAccountId: number;
    userId?: number;
    teamMemberType: number;
}

export interface TeamMemberResponse {
    id: string;
    name: string;
    type?: 'consultant' | 'client';
}

export interface ClientAccountTeamParameters {
    clientAccountTeam: ClientAccountTeam;
}