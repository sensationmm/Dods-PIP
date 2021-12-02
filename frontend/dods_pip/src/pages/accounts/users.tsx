import { useRouter } from 'next/router';
import React from 'react';

import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { PlainTable } from '../../components/DataTable';
import { Icons } from '../../components/Icon/assets';
import IconButton from '../../components/IconButton';
import Loader from '../../components/Loader';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import fetchJson from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
import { TeamMemberType } from '../account-management/add-client/type';
import { Role } from '../account-management/users.page';
import * as Styled from './index.styles';

export interface UsersProps {
  accountId: string;
}

export type TeamUser = {
  id: string;
  name: string;
  type: string;
  role?: Role;
  access?: string;
  primaryEmailAddress?: string;
  secondaryEmailAddress?: string;
  telephoneNumber1?: string;
  telephoneNumber2?: string;
  teamMemberType: number;
};

const Users: React.FC<UsersProps> = ({ accountId }) => {
  const [users, setUsers] = React.useState<TeamUser[]>();
  const router = useRouter();

  const loadUsers = async () => {
    if (accountId === '') {
      return false;
    }

    // get account info
    const response = await fetchJson(
      `${BASE_URI}${Api.ClientAccount}/${accountId}${Api.TeamMember}`,
      {
        method: 'GET',
      },
    );
    const { data = [] } = response;
    setUsers(data as TeamUser[]);
  };

  React.useEffect(() => {
    loadUsers();
  }, [accountId]);

  return (
    <Styled.sumWrapper>
      <SectionAccordion
        header={
          <Styled.sectionCustomHeader>
            <Text type="h2" headingStyle="titleLarge">
              User
            </Text>
            <Styled.badgeContainer>
              <Badge size="small" label="Seats allowance" number={undefined} />
              <Badge size="small" label="Seats remaning" number={undefined} />
              <Badge size="small" label="Active users" number={users ? users.length : undefined} />
              <Badge size="small" label="Inactive users" number={undefined} />
            </Styled.badgeContainer>
            <Button
              type="secondary"
              label="Add User"
              icon={Icons.Add}
              iconAlignment="right"
              onClick={(e) => e.stopPropagation()}
            />
          </Styled.sectionCustomHeader>
        }
        isOpen={true}
      >
        {!users ? (
          <Styled.loader>
            <Loader inline />
          </Styled.loader>
        ) : (
          <>
            <PlainTable
              headings={['Name', 'Email', 'Role', '']}
              colWidths={[4, 3, 2, 1]}
              rows={users
                .filter((user: TeamUser) => user.teamMemberType === TeamMemberType.ClientUser)
                .map((user) => {
                  return [
                    accountId,
                    <Styled.sumAvatarName key={`team-${user.name}`}>
                      <Avatar type="client" size="small" alt={user.name} />
                      <Text bold={true}>{user.name}</Text>
                    </Styled.sumAvatarName>,
                    <Text key={`${user.name}-email`}>
                      <a key={user.name} href={'mailto:' + user.primaryEmailAddress}>
                        {user.primaryEmailAddress}
                      </a>
                    </Text>,
                    <Text key={`${user.name}-role`}>{user?.role?.title}</Text>,
                    <IconButton
                      key={`${user.name}-link`}
                      onClick={() => router.push(`/users/${user.id}`)}
                      icon={Icons.ChevronRightBold}
                      type="text"
                      isSmall
                    />,
                  ];
                })}
            />
            <Styled.sumUserNav>
              <Text type="bodySmall">Total {users.length} Items</Text>
              <Text type="bodySmall">Viewing page 1 of 1</Text>
              <Text type="bodySmall">Items per page 10</Text>
            </Styled.sumUserNav>
          </>
        )}
      </SectionAccordion>
    </Styled.sumWrapper>
  );
};

export default Users;
