import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import InputSearch from '../../components/_form/InputSearch';
import Select from '../../components/_form/Select';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Avatar, { UserType } from '../../components/Avatar';
import AZFilter from '../../components/AZFilter';
import Breadcrumbs from '../../components/Breadcrumbs';
import Button from '../../components/Button';
import DataCount from '../../components/DataCount';
import DataTable from '../../components/DataTable';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';
import Pagination from '../../components/Pagination';
import Text from '../../components/Text';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import MockDataUsersAccounts from '../../mocks/data/users-accounts.json';
import { toQueryString } from '../../utils/api';
import * as Styled from './users.styles';

type UserAccount = {
  uuid: number;
  firstName: string;
  surName: string;
  account: string;
  email: string;
  role: string;
  type: UserType;
  active: boolean;
};

type FilterParams = {
  limit?: number;
  offset?: number;
  startsWith?: string;
  searchTerm?: string;
  status?: string;
};

enum UserStatusValue {
  Active = 'active',
  Inactive = 'inactive',
}

type userAccounts = UserAccount[];

interface UsersProps extends LoadingHOCProps {}

export const Users: React.FC<UsersProps> = ({ setLoading }) => {
  const mockUsers = MockDataUsersAccounts.users as userAccounts;
  const [showFilter, setShowFilter] = React.useState<boolean>(true);
  const [filterUsers, setFilterUsers] = React.useState<string>('');
  const [filterRole, setFilterRole] = React.useState<string>('');
  const [filterSearchText, setFilterSearchText] = React.useState<string>('');
  const [filterAZ, setFilterAZ] = React.useState<string>('');
  const [usersList, setUsersList] = React.useState<userAccounts>(mockUsers);
  const [total, setTotal] = React.useState<number>(0);
  const router = useRouter();

  const { activePage, numPerPage, PaginationStats, PaginationButtons } = Pagination(total);

  const getFilterQueryString = () => {
    const params: FilterParams = {
      limit: numPerPage,
      offset: activePage * numPerPage,
    };

    if (filterUsers !== '') {
      params.status =
        filterUsers === UserStatusValue.Active ? UserStatusValue.Active : UserStatusValue.Inactive;
    }

    if (filterAZ !== '') {
      params.startsWith = filterAZ;
    }

    if (filterSearchText !== '') {
      params.searchTerm = filterSearchText;
    }

    return toQueryString(params);
  };

  const loadFilteredUsers = async () => {
    setLoading(true);
    const queryString = getFilterQueryString();
    setTotal(usersList.length);
    setUsersList(usersList.slice(0, 30));
    setLoading(false);
    console.log(queryString);
  };

  React.useEffect(() => {
    loadFilteredUsers();
  }, [filterAZ, filterUsers, filterSearchText, numPerPage, activePage]);

  return (
    <div data-test="page-account-management-users">
      <Head>
        <title>Dods PIP | Account Management | Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Panel bgColor={color.base.greyLighter}>
        <Breadcrumbs
          history={[
            { href: '/account-management', label: 'Account Management' },
            { href: '/account-management/users', label: 'Users' },
          ]}
        />

        <Spacer size={6} />

        <Styled.header>
          <Text type="h1" headingStyle="hero">
            Users
          </Text>
          <Button
            data-test="btn-create-client-account"
            onClick={() => console.log('goes to add user page')}
            isSmall={false}
            icon={Icons.Add}
            label="Add User"
          />
        </Styled.header>

        <Spacer size={12} />

        <Styled.filterContainer>
          <Styled.filterToggle>
            <Styled.filterToggleBtn
              data-test="filter-toggle"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Text type="bodySmall" bold uppercase color={color.base.black}>
                Filter
              </Text>
              <Icon
                src={showFilter ? Icons.ChevronUpBold : Icons.ChevronDownBold}
                color={color.theme.blueMid}
              />
            </Styled.filterToggleBtn>

            <DataCount total={usersList.length} />
          </Styled.filterToggle>

          <Styled.filterContent open={showFilter} data-test="filter-content">
            <Styled.filterContentCol>
              <Select
                id="filter-user-status"
                size="medium"
                options={[
                  { value: '', label: 'All Users' },
                  { value: UserStatusValue.Active, label: 'Active Users' },
                  { value: UserStatusValue.Inactive, label: 'Inactive Users' },
                ]}
                onChange={setFilterUsers}
                value={filterUsers}
                placeholder="All Users"
                isFilter
              />
              <Select
                id="filter-user-role"
                size="medium"
                options={[
                  { value: '', label: 'Role' },
                  { value: 'Account Manager', label: 'Account Manager' },
                ]}
                onChange={setFilterRole}
                value={filterRole}
                placeholder="Role"
                isFilter
              />
            </Styled.filterContentCol>

            <Styled.filterContentCol>
              <InputSearch
                id="filter-search"
                onChange={setFilterSearchText}
                value={filterSearchText}
                size="medium"
              />
            </Styled.filterContentCol>
          </Styled.filterContent>
        </Styled.filterContainer>

        <Spacer size={4} />
        <AZFilter selectedLetter={filterAZ} setSelectedLetter={setFilterAZ} />

        <Spacer size={5} />

        <PaginationStats />

        <Spacer size={5} />

        <DataTable
          headings={['Name', 'Account', 'Email', 'Role', '']}
          colWidths={[8, 4, 4, 4, 1]}
          rows={usersList.map((user: UserAccount) => {
            const { uuid } = user;
            return [
              user.surName.substring(0, 1),
              <Styled.avatarName key={`user-${uuid}`}>
                <Avatar
                  type={user.type}
                  size="small"
                  disabled={!user.active}
                  alt={user.firstName + ' ' + user.surName}
                />
                <Text bold={true} color={!user.active ? color.base.grey : color.theme.blue}>
                  {user.firstName} {user.surName}
                </Text>
              </Styled.avatarName>,
              <Text key={`user-${uuid}-account`}>{user.account}</Text>,
              <Styled.email key={`user-${uuid}-email`}>
                <a href={'mailto:' + user.email}>{user.email}</a>
              </Styled.email>,
              <Text key={`user-${uuid}-role`}>{user.role}</Text>,
              <Icon key={`user-${uuid}-link`} src={Icons.ChevronRightBold} />,
            ];
          })}
        />

        <Spacer size={4} />

        <DataCount total={usersList.length} />
        <PaginationButtons />
      </Panel>
    </div>
  );
};

export default LoadingHOC(Users);
