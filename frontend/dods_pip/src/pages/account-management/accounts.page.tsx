import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import InputSearch from '../../components/_form/InputSearch';
import Select from '../../components/_form/Select';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import Avatar from '../../components/Avatar';
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
import useSubscriptionTypes from '../../lib/useSubscriptionTypes';
import { Api, BASE_URI, toQueryString } from '../../utils/api';
import * as Styled from './accounts.styles';
import { TeamMemberType } from './add-client/type';

type Filters = {
  search?: string;
  aToZ?: string;
  account?: string;
  subscription?: string;
};

type ClientAccountTeamMember = {
  id: string;
  name: string;
  teamMemberType: TeamMemberType;
};

type ClientAccount = {
  uuid: string;
  name: string;
  subscription: {
    id: string;
    name: string;
  };
  isEU: boolean;
  isUK: boolean;
  projects: number;
  team: ClientAccountTeamMember[];
  isCompleted: boolean;
};

type ClientAccounts = ClientAccount[];

type FilterParams = {
  isCompleted?: boolean;
  subscriptionTypes?: string;
  limit?: number;
  offset?: number;
  startsWith?: string;
  searchTerm?: string;
};

export enum AccountValue {
  Completed = 'completed',
  Incomplete = 'incomplete',
}

export enum LocationValue {
  EU = 'EU',
  UK = 'UK',
}

export const showTeamList = (team: ClientAccountTeamMember[]) => {
  let finalTeam = [];
  let teamList: ClientAccountTeamMember[] = team;
  const filterByClient = (team: ClientAccountTeamMember) =>
    team.teamMemberType === TeamMemberType.ClientUser;

  const filterByConsultant = (team: ClientAccountTeamMember) =>
    [TeamMemberType.AccountManager, TeamMemberType.TeamMember].includes(team.teamMemberType);

  const teamClient = team.slice(3).filter(filterByClient).length;
  const teamConsultant = team.slice(3).filter(filterByConsultant).length;

  if (team.length > 5) {
    if (teamClient > 0 && teamConsultant > 0) {
      teamList = team.slice(0, 3);
    } else if (teamClient > 0 || teamConsultant > 0) {
      teamList = team.slice(0, 4);
    }
  }

  const overflowTeamClient = team.slice(teamList.length).filter(filterByClient).length;
  const overflowTeamConsultant = team.slice(teamList.length).filter(filterByConsultant).length;

  finalTeam = teamList.map((member, count) => {
    const type = member.teamMemberType === TeamMemberType.ClientUser ? 'client' : 'consultant';
    return <Avatar key={`team-${count}`} type={type} size="small" alt={member.name} />;
  });
  if (overflowTeamClient > 0) {
    finalTeam.push(
      <Avatar key="overflow-client" type="client" number={overflowTeamClient} size="small" />,
    );
  }
  if (overflowTeamConsultant > 0) {
    finalTeam.push(
      <Avatar
        key="overflow-consultant"
        type="consultant"
        number={overflowTeamConsultant}
        size="small"
      />,
    );
  }

  return finalTeam;
};

interface AccountsProps extends LoadingHOCProps {}

export const Accounts: React.FC<AccountsProps> = ({ setLoading }) => {
  const [showFilter, setShowFilter] = React.useState<boolean>(true);
  const [filters, setFilters] = React.useState<Filters>({});
  const [accountsList, setAccountsList] = React.useState<ClientAccounts>([]);
  const [total, setTotal] = React.useState<number>(0);
  const debouncedValue = useDebounce<string>(filters?.search as string, 850);

  const router = useRouter();

  const { activePage, numPerPage, PaginationStats, PaginationButtons } = Pagination(total);

  const getFilterQueryString = () => {
    const params: FilterParams = {
      limit: numPerPage,
      offset: activePage * numPerPage,
      ...(filters.subscription && { subscriptionTypes: filters.subscription }),
      ...(filters.account && { isCompleted: filters.account === AccountValue.Completed }),
      ...(filters.aToZ && { startsWith: filters.aToZ }),
      ...(filters.search && { searchTerm: encodeURI(filters.search) }),
    };

    return toQueryString(params);
  };

  const loadFilteredAccounts = async () => {
    setLoading(true);
    const queryString = getFilterQueryString();
    try {
      const results = await fetchJson(`${BASE_URI}${Api.ClientAccount}${queryString}`, {
        method: 'GET',
      });
      const { data = [], totalRecords } = results;
      setAccountsList(data as ClientAccounts);
      setTotal(totalRecords as number);
    } catch (e) {
      setAccountsList([] as ClientAccounts);
      setTotal(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadFilteredAccounts();
    })();
  }, [debouncedValue, filters.subscription, filters.account, filters.aToZ, numPerPage, activePage]);

  const subscriptionPlaceholder = 'All Subscriptions';
  const { subscriptionList } = useSubscriptionTypes({ placeholder: subscriptionPlaceholder });

  const goToAccount = (id: string): void => {
    router.push(`/accounts/${id}`);
  };

  const goToAccountSetup = (id: string): void => {
    router.push(`/account-management/add-client?id=${id}`);
  };

  const renderInCompletedRow = (account: ClientAccount): Array<string | JSX.Element> => {
    const { uuid } = account;
    return [
      account.name.substring(0, 1),
      <Text key={`account-${uuid}-name`} bold>
        {account.name}
      </Text>,
      <Text key={`account-${uuid}-subscription`}>Account incomplete</Text>,
      <Text key={`account-${uuid}-projects`} />,
      <Styled.teamList key={`account-${uuid}-team`}>
        <Button type="text" label="Click to complete" onClick={() => goToAccountSetup(uuid)} />
      </Styled.teamList>,
      <IconButton
        key={`account-${uuid}-link`}
        onClick={() => goToAccountSetup(uuid)}
        icon={Icons.ChevronRightBold}
        type="text"
      />,
    ];
  };

  return (
    <div data-testid="page-account-management-clients">
      <Head>
        <title>Dods PIP | Account Management | Clients</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel bgColor={color.base.ivory}>
          <Breadcrumbs
            history={[
              { href: '/account-management', label: 'Account Management' },
              { href: '/account-management/accounts', label: 'Accounts' },
            ]}
          />

          <Spacer size={6} />

          <Styled.header>
            <Text type="h1" headingStyle="hero">
              Accounts
            </Text>
            <Button
              onClick={() => router.push('/account-management/add-client')}
              isSmall={false}
              icon={Icons.Add}
              label="Add Account"
            />
          </Styled.header>

          <Spacer size={12} />

          <Styled.filterContainer>
            <Styled.filterToggle>
              <Styled.filterToggleButton
                data-testid="account-page-filter-toggle"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Text type="bodySmall" bold uppercase color={color.base.black}>
                  Filter
                </Text>
                <Icon
                  src={showFilter ? Icons.ChevronUpBold : Icons.ChevronDownBold}
                  color={color.theme.blueMid}
                />
              </Styled.filterToggleButton>

              <DataCount total={accountsList.length} />
            </Styled.filterToggle>

            {showFilter && (
              <Styled.filterContent data-testid="account-page-filter-content">
                <Styled.filterContentCol>
                  <Select
                    testId="account-page-subscription-filter"
                    id="filter-subscription"
                    size="medium"
                    options={subscriptionList}
                    onChange={(value) => setFilters({ ...filters, ...{ subscription: value } })}
                    value={filters.subscription || ''}
                    placeholder={subscriptionPlaceholder}
                    isFilter
                  />
                  <Select
                    testId="account-page-account-filter"
                    id="filter-account"
                    size="medium"
                    options={[
                      { value: '', label: 'All Accounts' },
                      { value: AccountValue.Completed, label: 'Only Completed' },
                      { value: AccountValue.Incomplete, label: 'Only Incomplete' },
                    ]}
                    onChange={(value) => setFilters({ ...filters, ...{ account: value } })}
                    value={filters.account || ''}
                    placeholder="All Accounts"
                    isFilter
                  />
                </Styled.filterContentCol>

                <Styled.searchWrapper>
                  <InputSearch
                    testId="account-page-search"
                    id="filter-search"
                    onChange={(value) => setFilters({ ...filters, ...{ search: value } })}
                    value={filters.search || ''}
                    size="medium"
                  />
                </Styled.searchWrapper>
              </Styled.filterContent>
            )}
          </Styled.filterContainer>

          <Spacer size={4} />

          <AZFilter
            data-testid="account-page-az-filter"
            selectedLetter={filters.aToZ || ''}
            setSelectedLetter={(value) => setFilters({ ...filters, ...{ aToZ: value } })}
          />

          <Spacer size={5} />

          <PaginationStats />

          <Spacer size={5} />

          <DataTable
            data-testid="account-page-data-table"
            headings={['Name', 'Subscription', 'Live Collections', 'Team', '']}
            colWidths={[8, 4, 4, 4, 1]}
            rows={accountsList.map((account: ClientAccount) => {
              if (!account.isCompleted) {
                return renderInCompletedRow(account);
              }
              const { uuid } = account;

              return [
                account.name.substring(0, 1),
                <Text key={`account-${uuid}-name`} bold>
                  {account.name}
                </Text>,
                <Text key={`account-${uuid}-subscription`}>{account.subscription}</Text>,
                <Text key={`account-${uuid}-projects`}>{account.projects}</Text>,
                <Styled.teamList key={`account-${uuid}-team`}>
                  {showTeamList(account.team)}
                </Styled.teamList>,
                <IconButton
                  data-testid="account-page-btn-to-account"
                  key={`account-${uuid}-link`}
                  onClick={() => goToAccount(uuid)}
                  icon={Icons.ChevronRightBold}
                  type="text"
                  isSmall
                />,
              ];
            })}
          />

          <Spacer size={4} />

          <PaginationButtons data-testid="account-page-pagination" />
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Accounts);
