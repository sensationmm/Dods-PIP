export interface ClientAccountTeam {
    clientAccountId: number;
    userId?: number;
    teamMemberType: number;
}

export interface TeamMemberResponse {
    id: string;
    name: string;
    teamMemberType?: 'Team Member' | 'Account Manager' | 'Client User';
}

export interface TeamMember {
    userId?: string;
    teamMemberType: number;
}
export interface ClientAccountTeamParameters {
    clientAccountId: string;
    teamMembers: Array<TeamMember>;
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
