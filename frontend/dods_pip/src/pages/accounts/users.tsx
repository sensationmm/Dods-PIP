import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { PlainTable } from '../../components/DataTable';
import { Icons } from '../../components/Icon/assets';
import IconButton from '../../components/IconButton';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import SectionAccordion from '../../components/SectionAccordion';
import Text from '../../components/Text';
import color from '../../globals/color';
import { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson, { CustomResponse } from '../../lib/fetchJson';
import { Api, BASE_URI } from '../../utils/api';
import { getUserName } from '../../utils/string';
import { TeamMemberType } from '../account-management/add-client/type';
import { Role } from '../account-management/users.page';
import * as Styled from './index.styles';

export interface UsersProps {
  addNotification: LoadingHOCProps['addNotification'];
  setLoading: LoadingHOCProps['setLoading'];
  accountId: string;
  refetchSeats: boolean;
  setRefetchSeats: (refetch: boolean) => void;
  canAddNewUser?: boolean;
}

export type TeamUser = {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  role?: Role;
  access?: string;
  primaryEmailAddress?: string;
  secondaryEmailAddress?: string;
  telephoneNumber1?: string;
  telephoneNumber2?: string;
  teamMemberType: number;
  isActive?: number;
};

const Users: React.FC<UsersProps> = ({
  accountId,
  addNotification,
  setLoading,
  refetchSeats,
  setRefetchSeats,
  canAddNewUser = true,
}) => {
  const [users, setUsers] = React.useState<TeamUser[]>([]);
  const [remainingSeats, setRemainingSeats] = React.useState<number>();
  const [noRemainingSeatsModal, setNoRemainingSeatsModal] = React.useState(false);
  const [filteredClientUsers, setFilteredClientUsers] = React.useState<TeamUser[]>([]);
  const router = useRouter();

  // featching remainin seats
  const fetchRemainingSeats = async () => {
    setLoading(true);
    const result = await fetchJson<CustomResponse>(
      `${BASE_URI}${Api.ClientAccount}/${accountId}${Api.Seats}`,
      {
        method: 'GET',
      },
    );
    const { data } = result;
    setRemainingSeats(Number(data));
    setLoading(false);
  };

  useEffect(() => {
    //displaying notification to see if user has been created before redirecting back to this page

    if (router?.query?.userAdded) {
      addNotification({
        type: 'confirm',
        title: 'You have successfully created a new Client User',
      });
    }
    accountId && fetchRemainingSeats();
  }, [accountId]);

  useEffect(() => {
    refetchSeats && fetchRemainingSeats() && setRefetchSeats(false);
  }, [refetchSeats]);

  const loadUsers = async () => {
    if (accountId === '') {
      return false;
    }

    // get account info
    const response = await fetchJson<CustomResponse>(
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

  const clientUsers = users?.filter(
    (user: TeamUser) => user.teamMemberType === TeamMemberType.ClientUser,
  );
  const activeUsers = clientUsers?.filter((user) => user.isActive === 1).length;
  const inactiveUsers = clientUsers?.filter((user) => user.isActive === 0).length;
  const seatsAllowance =
    clientUsers && activeUsers !== undefined && remainingSeats !== undefined
      ? activeUsers + remainingSeats
      : 0;

  const filteredUsersTable = () => {
    const totalOfElements = activePage * numPerPage;
    const lastIndex = totalOfElements + numPerPage;
    const currentItems = clientUsers.slice(totalOfElements, lastIndex);
    if (currentItems.length > 0) {
      setFilteredClientUsers(currentItems);
    }
  };

  const customStatsOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
  ];

  const { PaginationButtons, PaginationStats, activePage, numPerPage } = Pagination(
    clientUsers.length,
    '5',
    customStatsOptions,
    false,
  );

  React.useEffect(() => {
    filteredUsersTable();
  }, [activePage, users, numPerPage]);

  const handleAddUser = async () => {
    if (remainingSeats && remainingSeats > 0) {
      router.push(
        `/account-management/add-user?type=accountsAddNewUser&referrer=${router.asPath}&accountId=${accountId}`,
      );
    } else {
      setNoRemainingSeatsModal(true);
    }
  };

  return (
    <Styled.sumWrapper>
      <SectionAccordion
        header={
          <Styled.sectionCustomHeader>
            <Text type="h2" headingStyle="titleLarge">
              User
            </Text>
            <Styled.badgeContainer>
              <Badge
                size="small"
                label="Seats allowance"
                number={remainingSeats !== undefined ? seatsAllowance : undefined}
              />
              <Badge size="small" label="Seats remaning" number={remainingSeats} />
              <Badge size="small" label="Active users" number={users ? activeUsers : undefined} />
              <Badge
                size="small"
                label="Inactive users"
                number={users ? inactiveUsers : undefined}
              />
            </Styled.badgeContainer>
            {canAddNewUser && (
              <Button
                type="secondary"
                label="Add User"
                icon={Icons.Add}
                iconAlignment="right"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddUser();
                }}
              />
            )}
          </Styled.sectionCustomHeader>
        }
        isOpen={true}
      >
        {!clientUsers ? (
          <Styled.loader>
            <Loader inline />
          </Styled.loader>
        ) : (
          <>
            <PlainTable
              headings={['Name', 'Email', 'Role', '']}
              colWidths={[4, 3, 2, 1]}
              rows={filteredClientUsers?.map((user, userCount) => {
                const name = getUserName(user);
                return [
                  accountId,
                  <Styled.sumAvatarName key={`team-${name}`}>
                    <Avatar type="client" size="small" alt={name} disabled={!user.isActive} />
                    <Text bold={true} color={!user.isActive ? color.base.grey : color.theme.blue}>
                      {name}
                    </Text>
                  </Styled.sumAvatarName>,
                  <Text key={`user-${userCount}-email`}>
                    <a key={`user-${userCount}`} href={'mailto:' + user.primaryEmailAddress}>
                      {user.primaryEmailAddress}
                    </a>
                  </Text>,
                  <Text key={`user-${userCount}-role`}>{user?.role?.title}</Text>,
                  <IconButton
                    key={`user-${userCount}-link`}
                    onClick={() => router.push(`/users/${user.id}`)}
                    icon={Icons.ChevronRightBold}
                    type="text"
                    isSmall
                  />,
                ];
              })}
            />
            <Styled.sumUserNav>
              <PaginationStats />
              <PaginationButtons />
            </Styled.sumUserNav>
          </>
        )}
      </SectionAccordion>

      {noRemainingSeatsModal && (
        <Modal
          title="User limit reached"
          size="large"
          onClose={() => setNoRemainingSeatsModal(false)}
        >
          <Text color={color.theme.blue}>
            You have a limited amount of seats allocated to your Account.
          </Text>
          <Text color={color.base.grey}>Contact the Account Lead to discuss the subscription.</Text>
        </Modal>
      )}
    </Styled.sumWrapper>
  );
};

export default Users;
