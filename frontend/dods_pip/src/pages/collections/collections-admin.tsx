import InputSearch from '@dods-ui/components/_form/InputSearch';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import AZFilter from '@dods-ui/components/AZFilter';
import Badge from '@dods-ui/components/Badge';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Button from '@dods-ui/components/Button';
import DataTable from '@dods-ui/components/DataTable';
import { Icons } from '@dods-ui/components/Icon/assets';
import IconButton from '@dods-ui/components/IconButton';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import { format } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import * as Styled from './collections.styles';
import { CollectionsScreenProps } from './index.page';

export const CollectionsAdmin: React.FC<CollectionsScreenProps> = ({
  setShowAdd,
  collectionsList,
  filters,
  setFilters,
  PaginationButtons,
  PaginationStats,
}) => {
  const router = useRouter();

  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div data-testid="page-account-management-users">
      <Head>
        <title>Dods | Collections</title>
      </Head>

      <main>
        <Panel bgColor={color.base.ivory}>
          <Breadcrumbs
            history={[
              { href: '/account-management', label: 'Account Management' },
              { href: '/collections', label: 'Collections' },
            ]}
          />

          <Spacer size={6} />
          <Styled.header>
            <Text type="h1" headingStyle="hero">
              Collections
            </Text>
            <Button
              data-test="btn-add-collection"
              isSmall={false}
              icon={Icons.Add}
              label="Add Collection"
              onClick={() => setShowAdd(true)}
            />
          </Styled.header>

          <Spacer size={12} />

          <Styled.searchFilter>
            <InputSearch
              id="collections-search"
              value={filters?.search || ''}
              onChange={(value: string) => setFilters({ ...filters, search: value })}
              placeholder="Search..."
            />
          </Styled.searchFilter>

          <Spacer size={3} />

          <AZFilter
            selectedLetter={filters.aToZ || ''}
            setSelectedLetter={(value) => setFilters({ ...filters, ...{ aToZ: value } })}
          />

          <Spacer size={5} />

          <PaginationStats />

          <Spacer size={10} />

          <DataTable
            colWidths={[10, 5, 4, 2, 1]}
            headings={['Name', 'Account', 'Last edit', 'Items', '']}
            emptyMessage={`No collection${
              hasFilters ? 's matching those criteria' : ' has been added'
            }`}
            emptyAction={
              !hasFilters ? (
                <Button
                  isSmall
                  type="text"
                  label="Add Collection"
                  icon={Icons.Add}
                  iconAlignment="right"
                  onClick={() => setShowAdd(true)}
                />
              ) : undefined
            }
            rows={collectionsList.map(({ uuid, name, updatedAt, clientAccount, alertsCount }) => [
              name.substring(0, 1),
              <Text key={`collection-${uuid}-name`} bold>
                <Link href={`/collections/${uuid}`} passHref>
                  <Styled.titleLink>{name}</Styled.titleLink>
                </Link>
              </Text>,
              <Text key={`collection-${uuid}-updated`}>{clientAccount.name}</Text>,
              <Text key={`collection-${uuid}-updated`}>
                {format(new Date(updatedAt), 'dd MMM yyyy')}
              </Text>,
              <Badge
                key={`collection-${uuid}-alerts`}
                size="small"
                label="Alerts"
                number={alertsCount}
              />,
              <IconButton
                key={`collection-${uuid}-link`}
                onClick={() => router.push(`/collections/${uuid}`)}
                icon={Icons.ChevronRightBold}
                type="text"
                isSmall
              />,
            ])}
          />
          <Spacer size={4} />
          <PaginationStats>
            <PaginationButtons />
          </PaginationStats>
        </Panel>
      </main>
    </div>
  );
};

export default CollectionsAdmin;
