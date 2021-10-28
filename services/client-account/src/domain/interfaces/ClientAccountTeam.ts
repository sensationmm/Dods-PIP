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

export interface NewTeamMemberParameters {
    userProfile: {
        title: string;
        first_name: string;
        last_name: string;
        primary_email_address: string;
        secondary_email_address?: string;
        telephone_number_1: string;
        telephone_number_2?: string;
        role_id: string;
    };
    teamMemberType: number;
    clientAccountId: string;
}