export enum TeamType {
  Consultant = 'consultant',
  Client = 'client',
}

export type TeamMember = {
  id: string;
  name: string;
  type: string;
};

// ideally we would have an endpoint to retrieve roles with their uuids
export enum RoleType {
  User = '24e7ca86-1788-4b6e-b153-9c963dc928cb',
  Admin = '0b4fc341-8992-48da-94c8-945b9b9fa7ea',
  DodsUser = '83618280-9c84-441c-94d1-59e4b24cbe3d',
  DodsAdmin = '5e2f23c3-1b53-4eea-b260-5d2cc05be38f',
  DodsAccMgr = '31becb0d-6dc7-4aa6-801b-080692c7d6ae',
}

export type DropdownValue = {
  label: string;
  value: string;
};
