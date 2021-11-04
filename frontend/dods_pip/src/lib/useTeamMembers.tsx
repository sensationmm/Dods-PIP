/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import fetchJson from '../lib/fetchJson';
import { Api, BASE_URI } from '../utils/api';
import { TeamMember, TeamType } from '../utils/type';

type Error = {
  code?: string;
  message?: string;
};

type UseTeamMembers = {
  clients: TeamMember[] | [];
  consultants: TeamMember[] | [];
  teams: TeamMember[] | [];
  error?: Error;
};

type params = {
  uuid: string;
  setConsultantUsers?: (vals: Array<TeamMember>) => void;
  setClientUsers?: (vals: Array<TeamMember>) => void;
};

export default function useTeamMembers({
  uuid,
  setClientUsers,
  setConsultantUsers,
}: params): UseTeamMembers {
  const [teams, setTeams] = useState<TeamMember[]>([]);
  const [consultants, setConsultants] = useState<TeamMember[]>([]);
  const [clients, setClients] = useState<TeamMember[]>([]);
  const [error, setError] = useState<Error>({});

  const load = async () => {
    try {
      const results = await fetchJson(`${BASE_URI}${Api.ClientAccount}/${uuid}${Api.TeamMember}`, {
        method: 'GET',
      });
      const { data = [] } = results;

      if (Array.isArray(data)) {
        setTeams(data);
        const consultantsOnly = data.filter(
          (team: TeamMember) => team.type === TeamType.Consultant,
        );
        const clientsOnly = data.filter((team: TeamMember) => team.type === TeamType.Client);
        setConsultants(consultantsOnly);
        setClients(clientsOnly);

        if (setConsultantUsers) {
          setConsultantUsers(consultantsOnly);
        }

        if (setClientUsers) {
          setClientUsers(clientsOnly);
        }
      }
    } catch ({ data = {} }) {
      setError(data as Error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { teams, consultants, clients, error };
}
