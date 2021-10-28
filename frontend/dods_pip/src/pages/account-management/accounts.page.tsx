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
import DataTable, { DataTableSort } from '../../components/DataTable';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';
import Pagination from '../../components/Pagination';
import Text from '../../components/Text';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import useSubscriptionTypes from '../../lib/useSubscriptionTypes';
import MockDataClientAccounts from '../../mocks/data/client-accounts.json';
import MockUserData from '../../mocks/data/users.json';
import * as Styled from './accounts.styles';

type AccountSubscription = 'level1' | 'level2' | 'level3' | 'level4';

type ClientAccountTeamMember = {
  name: string;
  type: 'consultant' | 'client';
};

type ClientAccount = {
  id: string;
  name: string;
  subscription: AccountSubscription;
  location: string;
  projects: number;
  team: ClientAccountTeamMember[];
  completed: boolean;
};

type ClientAccounts = ClientAccount[];

interface AccountsProps extends LoadingHOCProps {}

export const Accounts: React.FC<AccountsProps> = () => {
  const accountsList = MockDataClientAccounts.accounts as ClientAccounts;
  const [showFilter, setShowFilter] = React.useState<boolean>(true);
  const [filterSearchText, setFilterSearchText] = React.useState<string>('');
  const [filterAZ, setFilterAZ] = React.useState<string>('');
  const [filterSubscription, setFilterSubscription] = React.useState<string>('');
  const [filterLocation, setFilterLocation] = React.useState<string>('');
  const router = useRouter();

  const filterAccounts = (data: ClientAccounts) => {
    let filteredData: ClientAccounts = data;

    if (filterSearchText !== '' && typeof filterSearchText === 'string') {
      filteredData = filteredData.filter(
        (item: ClientAccount) =>
          item.name.toLowerCase().indexOf(filterSearchText.toLowerCase()) >= 0,
      );
    }

    if (filterAZ !== '') {
      filteredData = filteredData.filter(
        (item: ClientAccount) => item.name.substr(0, 1) === filterAZ,
      );
    }

    if (filterSubscription !== '') {
      filteredData = filteredData.filter(
        (item: ClientAccount) => item.subscription === filterSubscription,
      );
    }

    if (filterLocation !== '') {
      filteredData = filteredData.filter((item: ClientAccount) => item.location === filterLocation);
    }

    return filteredData;
  };

  const { PaginationStats, PaginationContent, PaginationButtons } = Pagination(
    filterAccounts(accountsList).length,
  );

  const accountsData = PaginationContent<ClientAccounts>(
    filterAccounts(DataTableSort(accountsList)),
  );

  const subscriptionPlaceholder = 'All Subscriptions';
  const { subscriptionList } = useSubscriptionTypes({ placeholder: subscriptionPlaceholder });

  return (
    <div data-test="page-account-management-clients">
      <Head>
        <title>Dods PIP | Account Management | Clients</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Panel>
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

              <Styled.dataCount>
                <Text type="bodySmall" color={color.base.grey}>
                  Total{' '}
                  <span style={{ color: color.theme.blueMid }}>
                    <strong data-test="items-count">{filterAccounts(accountsList).length}</strong>
                  </span>{' '}
                  items
                </Text>
              </Styled.dataCount>
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
                  id="filter-location"
                  size="small"
                  options={[
                    { value: '', label: 'All Locations' },
                    { value: 'europe', label: 'Europe' },
                    { value: 'north-america', label: 'North America' },
                    { value: 'south-america', label: 'South America' },
                    { value: 'asia', label: 'Asia' },
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
            headings={['Name', 'Subscription', 'Live projects', 'Team', '']}
            colWidths={[8, 4, 4, 4, 1]}
            rows={accountsData.map((account: ClientAccount, count: number) => {
              const teamClient = account.team
                .slice(3)
                .filter((team) => team.type === 'client').length;
              const teamConsultant = account.team
                .slice(3)
                .filter((team) => team.type === 'consultant').length;

              let team = account.team;

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
                <Text key={`account-${count}-name`} bold>
                  {account.name}
                </Text>,
                <Text key={`account-${count}-subscription`}>{account.subscription}</Text>,
                <Text key={`account-${count}-projects`}>{account.projects}</Text>,
                <Styled.teamList key={`account-${count}-team`}>
                  {team.map((member, count2) => {
                    const randomName =
                      MockUserData.users[Math.floor(Math.random() * MockUserData.users.length)]
                        .label;
                    return (
                      <Avatar
                        key={`team-${count2}`}
                        type={member.type}
                        size="small"
                        alt={randomName}
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
                <Icon key={`account-${count}-link`} src={Icons.ChevronRightBold} />,
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
