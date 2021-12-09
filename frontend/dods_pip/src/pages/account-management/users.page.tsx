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
import IconButton from '../../components/IconButton';
import Pagination from '../../components/Pagination';
import Text from '../../components/Text';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import fetchJson from '../../lib/fetchJson';
import useDebounce from '../../lib/useDebounce';
import { Api, BASE_URI, toQueryString } from '../../utils/api';
import { getUserName } from '../../utils/string';
import { RoleType } from './add-client/type';
import * as Styled from './users.styles';

type Filters = {
  search?: string;
  aToZ?: string;
  isActive?: string;
  role?: string;
};

export type Role = {
  uuid: string;
  title: string;
  dodsRole: number;
};

export type UserAccount = {
  uuid: number;
  firstName: string;
  lastName: string;
  account: string;
  email: string;
  role: Role;
  type: UserType;
  isActive: boolean;
  isDodsUser: boolean;
};

type FilterParams = {
  limit?: number;
  offset?: number;
  startsWith?: string;
  name?: string;
  isActive?: string;
  role?: string;
};

type userAccounts = UserAccount[];

interface UsersProps extends LoadingHOCProps {}

export const Users: React.FC<UsersProps> = ({ setLoading }) => {
  const [showFilter, setShowFilter] = React.useState<boolean>(true);
  const [filters, setFilters] = React.useState<Filters>({});
  const [usersList, setUsersList] = React.useState<userAccounts>([]);
  const [total, setTotal] = React.useState<number>(0);
  const debouncedValue = useDebounce<string>(filters?.search as string, 850);

  const router = useRouter();

  const { activePage, numPerPage, PaginationStats, PaginationButtons } = Pagination(total);

  const getFilterQueryString = () => {
    const params: FilterParams = {
      limit: numPerPage,
      offset: activePage * numPerPage,
      ...(filters.isActive && { isActive: filters.isActive }),
      ...(filters.role && { role: filters.role }),
      ...(filters.aToZ && { startsWith: filters.aToZ }),
      ...(filters.search && { name: encodeURI(filters.search) }),
    };

    return toQueryString(params);
  };

  const loadFilteredUsers = async () => {
    setLoading(true);
    const queryString = getFilterQueryString();
    try {
      const results = await fetchJson(`${BASE_URI}${Api.Users}${queryString}`, {
        method: 'GET',
      });
      const { data = [], totalRecords } = results;
      setUsersList(data as userAccounts);
      setTotal(totalRecords as number);
    } catch (error) {
      setUsersList([] as userAccounts);
      setTotal(0);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadFilteredUsers();
  }, [
    debouncedValue,
    filters.aToZ,
    filters.isActive,
    filters.role,
    filters.search,
    numPerPage,
    activePage,
  ]);

  return (
    <div data-testid="page-account-management-users">
      <Head>
        <title>Dods PIP | Account Management | Users</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Panel bgColor={color.base.ivory}>
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
            isSmall={false}
            icon={Icons.Add}
            label="Add User"
            onClick={() => router.push('/account-management/add-user')}
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
                  { value: 'true', label: 'Active Users' },
                  { value: 'false', label: 'Inactive Users' },
                ]}
                onChange={(value) => setFilters({ ...filters, ...{ isActive: value } })}
                value={filters.isActive || ''}
                placeholder="All Users"
                isFilter
              />
              <Select
                id="filter-user-role"
                size="medium"
                options={[
                  { value: '', label: 'Role' },
                  { value: RoleType.DodsConsultant, label: 'Consultant' },
                  { value: RoleType.ClientUser, label: 'User' },
                ]}
                onChange={(value) => setFilters({ ...filters, ...{ role: value } })}
                value={filters.role || ''}
                placeholder="Role"
                isFilter
              />
            </Styled.filterContentCol>

            <Styled.filterContentCol>
              <InputSearch
                id="filter-search"
                onChange={(value) => setFilters({ ...filters, ...{ search: value } })}
                value={filters.search || ''}
                size="medium"
              />
            </Styled.filterContentCol>
          </Styled.filterContent>
        </Styled.filterContainer>

        <Spacer size={4} />
        <AZFilter
          selectedLetter={filters.aToZ || ''}
          setSelectedLetter={(value) => setFilters({ ...filters, ...{ aToZ: value } })}
        />

        <Spacer size={5} />

        <PaginationStats />

        <Spacer size={5} />

        <DataTable
          headings={['Name', 'Account', 'Email', 'Role', '']}
          colWidths={[8, 4, 4, 4, 1]}
          rows={usersList.map((user: UserAccount) => {
            const { uuid } = user;
            return [
              user.lastName.substring(0, 1),
              <Styled.avatarName key={`user-${uuid}`}>
                <Avatar
                  type={user.isDodsUser ? 'consultant' : 'client'}
                  size="small"
                  disabled={!user.isActive}
                  alt={getUserName(user)}
                />
                <Text bold={true} color={!user.isActive ? color.base.grey : color.theme.blue}>
                  {getUserName(user)}
                </Text>
              </Styled.avatarName>,
              <Text key={`user-${uuid}-account`}>{user.account}</Text>,
              <Styled.email key={`user-${uuid}-email`}>
                <a href={'mailto:' + user.email}>{user.email}</a>
              </Styled.email>,
              <Text key={`user-${uuid}-role`}>{user.role.title}</Text>,
              <IconButton
                data-testid="account-page-btn-to-account"
                key={`user-${uuid}-link`}
                onClick={() => router.push(`/users/${uuid}`)}
                icon={Icons.ChevronRightBold}
                type="text"
                isSmall
              />,
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
