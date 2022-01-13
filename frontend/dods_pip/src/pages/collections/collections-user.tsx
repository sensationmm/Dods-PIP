import InputSearch from '@dods-ui/components/_form/InputSearch';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Badge from '@dods-ui/components/Badge';
import Button from '@dods-ui/components/Button';
import { PlainTable } from '@dods-ui/components/DataTable';
import { Icons } from '@dods-ui/components/Icon/assets';
import IconButton from '@dods-ui/components/IconButton';
import Pagination from '@dods-ui/components/Pagination';
import Text from '@dods-ui/components/Text';
import fetchJson from '@dods-ui/lib/fetchJson';
import useDebounce from '@dods-ui/lib/useDebounce';
import { Api, BASE_URI, toQueryString } from '@dods-ui/utils/api';
import { format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import * as Styled from './collections.styles';
import { Collections, CollectionsScreenProps, FilterParams } from './index.page';

export const CollectionsUser: React.FC<CollectionsScreenProps> = ({
  user,
  setLoading,
  setShowAdd,
}) => {
  const [search, setSearch] = React.useState<string>('');
  const [total, setTotal] = React.useState<number>(0);
  const [collectionsList, setCollectionsList] = React.useState<Collections>([]);
  const debouncedValue = useDebounce<string>(search as string, 850);
  const router = useRouter();

  const { clientAccountId } = user;

  const { activePage, numPerPage, PaginationButtons, PaginationStats } = Pagination(total, '10');

  const getFilterQueryString = () => {
    const params: FilterParams = {
      limit: numPerPage,
      offset: activePage * numPerPage,
      ...(search && { searchTerm: encodeURI(search) }),
    };

    return toQueryString(params);
  };

  const loadCollections = async () => {
    setLoading(true);
    const queryString = getFilterQueryString();
    try {
      const results = await fetchJson(
        `${BASE_URI}${Api.Collections}/${clientAccountId}${queryString}`,
        {
          method: 'GET',
        },
      );
      const { data = [], filteredRecords } = results;
      setCollectionsList(data as Collections);
      setTotal(filteredRecords as number);
    } catch (e) {
      setCollectionsList([] as Collections);
      setTotal(0);
    }

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadCollections();
    })();
  }, [debouncedValue, numPerPage, activePage]);

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
                  value={search}
                  onChange={setSearch}
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
