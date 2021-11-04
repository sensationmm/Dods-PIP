export enum TeamType {
  Consultant = 'consultant',
  Client = 'client',
}

export type TeamMember = {
  id: string;
  name: string;
  type: string;
};
