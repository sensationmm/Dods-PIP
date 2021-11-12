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
  location?: string;
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
  locations?: string;
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
      ...(filters.location && {
        locations: filters.location === LocationValue.UK ? LocationValue.UK : LocationValue.EU,
      }),
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
  }, [
    debouncedValue,
    filters.subscription,
    filters.account,
    filters.aToZ,
    filters.location,
    numPerPage,
    activePage,
  ]);

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
        <Panel bgColor={color.base.greyLighter}>
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
              isSmall
              icon={Icons.Add}
              label="Add Client Account"
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
                    size="small"
                    options={subscriptionList}
                    onChange={(value) => setFilters({ ...filters, ...{ subscription: value } })}
                    value={filters.subscription || ''}
                    placeholder={subscriptionPlaceholder}
                    isFilter
                  />
                  <Select
                    testId="account-page-account-filter"
                    id="filter-account"
                    size="small"
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
                  <Select
                    testId="account-page-location-filter"
                    id="filter-location"
                    size="small"
                    options={[
                      { value: '', label: 'All Locations' },
                      { value: LocationValue.EU, label: 'Europe' },
                      { value: LocationValue.UK, label: 'UK' },
                    ]}
                    onChange={(value) => setFilters({ ...filters, ...{ location: value } })}
                    value={filters.location || ''}
                    placeholder="All Locations"
                    isFilter
                  />
                </Styled.filterContentCol>

                <Styled.filterContentCol>
                  <InputSearch
                    testId="account-page-search"
                    id="filter-search"
                    onChange={(value) => setFilters({ ...filters, ...{ search: value } })}
                    value={filters.search || ''}
                    size="small"
                  />
                </Styled.filterContentCol>
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
              const filterByClient = (team: ClientAccountTeamMember) =>
                team.teamMemberType === TeamMemberType.ClientUser;

              const filterByConsultant = (team: ClientAccountTeamMember) =>
                [TeamMemberType.AccountManager, TeamMemberType.TeamMember].includes(
                  team.teamMemberType,
                );

              const teamClient = account.team.slice(3).filter(filterByClient).length;
              const teamConsultant = account.team.slice(3).filter(filterByConsultant).length;

              let team = account.team;

              /* istanbul ignore else */
              if (account.team.length > 5) {
                if (teamClient > 0 && teamConsultant > 0) {
                  team = account.team.slice(0, 3);
                } else if (teamClient > 0 || teamConsultant > 0) {
                  team = account.team.slice(0, 4);
                }
              }

              const overflowTeamClient = account.team
                .slice(team.length)
                .filter(filterByClient).length;
              const overflowTeamConsultant = account.team
                .slice(team.length)
                .filter(filterByConsultant).length;

              return [
                account.name.substring(0, 1),
                <Text key={`account-${uuid}-name`} bold>
                  {account.name}
                </Text>,
                <Text key={`account-${uuid}-subscription`}>{account.subscription}</Text>,
                <Text key={`account-${uuid}-projects`}>{account.projects}</Text>,
                <Styled.teamList key={`account-${uuid}-team`}>
                  {team.map((member) => {
                    const type =
                      member.teamMemberType === TeamMemberType.ClientUser ? 'client' : 'consultant';
                    return (
                      <Avatar
                        key={`team-${member.id}`}
                        type={type}
                        size="small"
                        alt={member.name}
                      />
                    );
                  })}
                  {overflowTeamClient > 0 && (
                    <Avatar type="client" number={overflowTeamClient} size="small" />
                  )}
                  {overflowTeamConsultant > 0 && (
                    <Avatar type="consultant" number={overflowTeamConsultant} size="small" />
                  )}
                </Styled.teamList>,
                <IconButton
                  data-testid="account-page-btn-to-account"
                  key={`account-${uuid}-link`}
                  onClick={() => goToAccount(uuid)}
                  icon={Icons.ChevronRightBold}
                  type="text"
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
