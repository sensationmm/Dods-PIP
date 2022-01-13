import InputSearch from '@dods-ui/components/_form/InputSearch';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Badge from '@dods-ui/components/Badge';
import Button from '@dods-ui/components/Button';
import { PlainTable } from '@dods-ui/components/DataTable';
import { Icons } from '@dods-ui/components/Icon/assets';
import IconButton from '@dods-ui/components/IconButton';
import Text from '@dods-ui/components/Text';
import { format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import * as Styled from './collections.styles';
import { CollectionsScreenProps } from './index.page';

export const CollectionsUser: React.FC<CollectionsScreenProps> = ({
  setShowAdd,
  collectionsList,
  filters,
  setFilters,
  total,
  PaginationButtons,
  PaginationStats,
}) => {
  const router = useRouter();

  return (
    <div data-test="page-collections">
      <Head>
        <title>Dods PIP | Collections</title>
      </Head>

      <main>
        <Panel>
          <Text type={'h1'} headingStyle="heroExtraLarge">
            Collections
          </Text>
          <Spacer size={12} />
          <Styled.allCollections>
            <Styled.allCollectionsHeader>
              <Styled.allCollectionsTitle>
                <Text type="h2" headingStyle="titleLarge">
                  Account Collections
                </Text>
                <Badge size="small" label="Collections" number={total} />
              </Styled.allCollectionsTitle>

              <Styled.allCollectionsFilter>
                <InputSearch
                  id="collections-search"
                  size="small"
                  value={filters?.search || ''}
                  onChange={(value: string) => setFilters({ ...filters, search: value })}
                  placeholder="Search a collection"
                />
                <Button
                  isSmall
                  type="secondary"
                  label="Add Collection"
                  icon={Icons.Add}
                  iconAlignment="right"
                  onClick={() => setShowAdd(true)}
                />
              </Styled.allCollectionsFilter>
            </Styled.allCollectionsHeader>

            <PlainTable
              colWidths={[15, 4, 2, 1]}
              headings={['Name', 'Last edit', 'Items', '']}
              emptyMessage="No collection has been added"
              emptyAction={
                <Button
                  isSmall
                  type="text"
                  label="Add Collection"
                  icon={Icons.Add}
                  iconAlignment="right"
                  onClick={() => setShowAdd(true)}
                />
              }
              rows={collectionsList.map(({ uuid, name, updatedAt, alertsCount }) => [
                uuid,
                <Text key={`collection-${uuid}-name`} bold>
                  {name}
                </Text>,
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
            <Spacer size={3} />
            <Styled.allCollectionsFooter>
              <PaginationStats>
                <PaginationButtons />
              </PaginationStats>
            </Styled.allCollectionsFooter>
          </Styled.allCollections>
        </Panel>
      </main>
    </div>
  );
};

export default CollectionsUser;
