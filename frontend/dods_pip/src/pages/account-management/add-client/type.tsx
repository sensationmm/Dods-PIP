export enum TeamType {
  Consultant = 'consultant',
  Client = 'client',
}

export type TeamMember = {
  id: string;
  name: string;
  type?: string;
  teamMemberType: TeamMemberType;
  access?: string;
  primaryEmailAddress?: string;
  secondaryEmailAddress?: string;
  telephoneNumber1?: string;
  telephoneNumber2?: string;
};

export enum TeamMemberType {
  AccountManager = 2,
  TeamMember = 1,
  ClientUser = 3,
}

export enum RenewalType {
  Annual = 'annual',
  EndDate = 'endDate',
}

export enum DateFormat {
  UI = 'dd/MM/yyyy',
  API = 'yyyy-MM-dd',
}

export enum EndDateType {
  One = '1year',
  Two = '2year',
  Three = '3year',
  Trial = '2weektrial',
  Custom = 'custom',
}

export type SubscriptionType = {
  uuid: string;
  name: string;
};

// ideally we would have an endpoint to retrieve roles with their uuids
export enum RoleType {
  ClientUser = '24e7ca86-1788-4b6e-b153-9c963dc928cb',
  DodsConsultant = '83618280-9c84-441c-94d1-59e4b24cbe3d',
}

export type DropdownValue = {
  label: string;
  value: string;
  userData?: TeamMember | Record<string, unknown>;
};
