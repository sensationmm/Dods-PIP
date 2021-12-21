/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import fetchJson from '../lib/fetchJson';
import {
  DropdownValue,
  TeamMember,
  TeamMemberType,
} from '../pages/account-management/add-client/type';
import { Api, BASE_URI } from '../utils/api';
import { getUserName } from '../utils/string';

type Error = {
  code?: string;
  message?: string;
};

type UseTeamMembers = {
  error?: Error;
};

type params = {
  accountId: string;
  setAccountManagers?: (vals: Array<DropdownValue>) => void;
  setTeamMembers?: (vals: Array<DropdownValue>) => void;
  setClientUsers?: (vals: Array<DropdownValue>) => void;
};

export default function useTeamMembers({
  accountId,
  setClientUsers,
  setAccountManagers,
  setTeamMembers,
}: params): UseTeamMembers {
  const [error, setError] = useState<Error>({});

  const load = async () => {
    try {
      const results = await fetchJson(
        `${BASE_URI}${Api.ClientAccount}/${accountId}${Api.TeamMember}`,
        {
          method: 'GET',
        },
      );
      const { data = [] } = results;

      if (Array.isArray(data)) {
        const accountManagers = data.filter(
          (team: TeamMember) => team.teamMemberType === TeamMemberType.AccountManager,
        );
        const teamMembers = data.filter(
          (team: TeamMember) => team.teamMemberType === TeamMemberType.TeamMember,
        );
        const clientUsers = data.filter(
          (team: TeamMember) => team.teamMemberType === TeamMemberType.ClientUser,
        );

        if (setAccountManagers) {
          setAccountManagers(
            accountManagers.map((item: TeamMember) => ({
              label: getUserName(item),
              value: item.id,
              userData: item,
            })),
          );
        }

        if (setTeamMembers) {
          setTeamMembers(
            teamMembers.map((item: TeamMember) => ({
              label: getUserName(item),
              value: item.id,
              userData: item,
            })),
          );
        }

        if (setClientUsers) {
          setClientUsers(
            clientUsers.map((item: TeamMember) => ({
              label: getUserName(item),
              value: item.id,
              userData: item,
            })),
          );
        }
      }
    } catch ({ data = {} }) {
      setError(data as Error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { error };
}
