import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

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
import useSubscriptionTypes from '../../lib/useSubscriptionTypes';
import { Api, BASE_URI, toQueryString } from '../../utils/api';
import * as Styled from './accounts.styles';

type ClientAccountTeamMember = {
  id: string;
  name: string;
  type: 'consultant' | 'client';
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

enum AccountValue {
  Completed = 'completed',
  Incomplete = 'incomplete',
}

enum LocationValue {
  EU = 'EU',
  UK = 'UK',
}

interface AccountsProps extends LoadingHOCProps {}

export const Accounts: React.FC<AccountsProps> = ({ setLoading }) => {
  const [showFilter, setShowFilter] = React.useState<boolean>(true);
  const [filterSearchText, setFilterSearchText] = React.useState<string>('');
  const [filterAZ, setFilterAZ] = React.useState<string>('');
  const [filterAccount, setFilterAccount] = React.useState<string>('');
  const [filterSubscription, setFilterSubscription] = React.useState<string>('');
  const [filterLocation, setFilterLocation] = React.useState<string>('');
  const [accountsList, setAccountsList] = React.useState<ClientAccounts>([]);
  const [total, setTotal] = React.useState<number>(0);
  const router = useRouter();

  const { activePage, numPerPage, PaginationStats, PaginationButtons } = Pagination(total);

  const getFilterQueryString = () => {
    const params: FilterParams = {
      limit: numPerPage,
      offset: activePage * numPerPage,
    };

    if (filterSubscription !== '') {
      params.subscriptionTypes = filterSubscription;
    }

    if (filterAccount !== '') {
      params.isCompleted = filterAccount === AccountValue.Completed;
    }

    if (filterLocation !== '') {
      params.locations = filterLocation === LocationValue.UK ? LocationValue.UK : LocationValue.EU;
    }

    if (filterAZ !== '') {
      params.startsWith = filterAZ;
    }

    if (filterSearchText !== '') {
      params.searchTerm = filterSearchText;
    }

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

  React.useEffect(() => {
    loadFilteredAccounts();
  }, [
    filterSubscription,
    filterAccount,
    filterLocation,
    filterAZ,
    filterSearchText,
    numPerPage,
    activePage,
  ]);

  const subscriptionPlaceholder = 'All Subscriptions';
  const { subscriptionList } = useSubscriptionTypes({ placeholder: subscriptionPlaceholder });

  const goToClientAccount = (id: string): void => {
    router.push(`/account-management/add-client?id=${id}`);
  };

  const renderInCompletedRow = (account: ClientAccount): Array<any> => {
    const { uuid } = account;
    return [
      account.name.substring(0, 1),
      <Text key={`account-${uuid}-name`} bold>
        {account.name}
      </Text>,
      <Text key={`account-${uuid}-subscription`}>Account incomplete</Text>,
      <Text key={`account-${uuid}-projects`}></Text>,
      <Styled.teamList key={`account-${uuid}-team`}>
        <Button type="text" label="Click to complete" onClick={() => goToClientAccount(uuid)} />
      </Styled.teamList>,
      <IconButton
        key={`account-${uuid}-link`}
        onClick={() => goToClientAccount(uuid)}
        icon={Icons.ChevronRightBold}
        type="text"
      />,
    ];
  };

  return (
    <div data-test="page-account-management-clients">
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
              data-test="btn-create-client-account"
              onClick={() => router.push('/account-management/add-client')}
              isSmall
              icon={Icons.Add}
              label="Add Client Account"
            />
          </Styled.header>

          <Spacer size={12} />

          <Styled.filterContainer>
            <Styled.filterToggle>
              <Styled.filterToggleButon
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
              </Styled.filterToggleButon>

              <DataCount total={accountsList.length} />
            </Styled.filterToggle>

            <Styled.filterContent open={showFilter} data-test="filter-content">
              <Styled.filterContentCol>
                <Select
                  id="filter-subscription"
                  size="small"
                  options={subscriptionList}
                  onChange={setFilterSubscription}
                  value={filterSubscription}
                  placeholder={subscriptionPlaceholder}
                  isFilter
                />
                <Select
                  id="filter-account"
                  size="small"
                  options={[
                    { value: '', label: 'All Accounts' },
                    { value: AccountValue.Completed, label: 'Only Completed' },
                    { value: AccountValue.Incomplete, label: 'Only Incomplete' },
                  ]}
                  onChange={setFilterAccount}
                  value={filterAccount}
                  placeholder="All Accounts"
                  isFilter
                />
                <Select
                  id="filter-location"
                  size="small"
                  options={[
                    { value: '', label: 'All Locations' },
                    { value: LocationValue.EU, label: 'Europe' },
                    { value: LocationValue.UK, label: 'UK' },
                  ]}
                  onChange={setFilterLocation}
                  value={filterLocation}
                  placeholder="All Locations"
                  isFilter
                />
              </Styled.filterContentCol>

              <Styled.filterContentCol>
                <InputSearch
                  id="filter-search"
                  onChange={setFilterSearchText}
                  value={filterSearchText}
                  size="small"
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
            headings={['Name', 'Subscription', 'Live Collections', 'Team', '']}
            colWidths={[8, 4, 4, 4, 1]}
            rows={accountsList.map((account: ClientAccount) => {
              if (!account.isCompleted) {
                return renderInCompletedRow(account);
              }
              const { uuid } = account;

              const teamClient = account.team
                .slice(3)
                .filter((team) => team.type === 'client').length;
              const teamConsultant = account.team
                .slice(3)
                .filter((team) => team.type === 'consultant').length;

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
                .filter((team) => team.type === 'client').length;
              const overflowTeamConsultant = account.team
                .slice(team.length)
                .filter((team) => team.type === 'consultant').length;

              return [
                account.name.substring(0, 1),
                <Text key={`account-${uuid}-name`} bold>
                  {account.name}
                </Text>,
                <Text key={`account-${uuid}-subscription`}>{account.subscription}</Text>,
                <Text key={`account-${uuid}-projects`}>{account.projects}</Text>,
                <Styled.teamList key={`account-${uuid}-team`}>
                  {team.map((member) => {
                    return (
                      <Avatar
                        key={`team-${member.id}`}
                        type={member.type}
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
                  key={`account-${uuid}-link`}
                  onClick={() => goToClientAccount(uuid)}
                  icon={Icons.ChevronRightBold}
                  type="text"
                />,
              ];
            })}
          />

          <Spacer size={4} />

          <PaginationButtons />
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Accounts);
