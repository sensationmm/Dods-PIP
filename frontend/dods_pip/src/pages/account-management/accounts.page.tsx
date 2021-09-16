import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import InputSearch from '../../components/_form/InputSearch';
import Panel from '../../components/_layout/Panel';
import Spacer from '../../components/_layout/Spacer';
import AZFilter from '../../components/AZFilter';
import Breadcrumbs from '../../components/Breadcrumbs';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';
import Pagination from '../../components/Pagination';
import Text from '../../components/Text';
import color from '../../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../../hoc/LoadingHOC';
import MockDataClientAccounts from '../../mocks/data/client-accounts.json';
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

  const accountsData = PaginationContent<ClientAccounts>(filterAccounts(accountsList));

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
            <Text type="h1">Accounts</Text>
            <Button
              data-test="btn-create-client-account"
              onClick={() => router.push('/account-management/add-client')}
              isSmall
              icon={Icons.IconAdd}
              label="Add Client Account"
            />
          </Styled.header>

          <Spacer size={12} />

          <Styled.filterContainer>
            <Styled.filterToggle>
              <div data-test="filter-toggle" onClick={() => setShowFilter(!showFilter)}>
                <Text type="bodySmall" bold uppercase color={color.base.black}>
                  Filter
                  <Icon
                    src={showFilter ? Icons.IconChevronUp : Icons.IconChevronDown}
                    color={color.theme.blueMid}
                  />
                </Text>
              </div>

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
                {/* @TODO: replace html selects with <Select /> component when built DOD-376 */}
                {/* hence istanbul ignores, wasnt worth testing temporary code */}
                <select
                  value={filterSubscription}
                  onChange={/* istanbul ignore next*/ (e) => setFilterSubscription(e.target.value)}
                >
                  <option value="">All Subscriptions</option>
                  <option value="level1">Level 1</option>
                  <option value="level2">Level 2</option>
                  <option value="level3">Level 3</option>
                  <option value="level4">Level 4</option>
                </select>
                <select
                  value={filterLocation}
                  onChange={/* istanbul ignore next*/ (e) => setFilterLocation(e.target.value)}
                >
                  <option value="">Location</option>
                  <option value="europe">Europe</option>
                  <option value="north-america">North America</option>
                  <option value="south-america">South America</option>
                  <option value="asia">Asia</option>
                </select>
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

          {/* @TODO: replace with data table for rendering */}
          {/*<DataTable data={accountsData} /> */}
          {accountsData.map((account: ClientAccount, count: number) => {
            return <div key={`account-${count}`}>{account.name}</div>;
          })}

          <Spacer size={4} />

          <PaginationButtons />
        </Panel>
      </main>
    </div>
  );
};

export default LoadingHOC(Accounts);
