import DatePicker from '@dods-ui/components/_form/DatePicker';
import InputSearch from '@dods-ui/components/_form/InputSearch';
import SearchDropdown from '@dods-ui/components/_form/SearchDropdown';
import Box from '@dods-ui/components/_layout/Box';
import Panel from '@dods-ui/components/_layout/Panel';
import Spacer from '@dods-ui/components/_layout/Spacer';
import Breadcrumbs from '@dods-ui/components/Breadcrumbs';
import Button from '@dods-ui/components/Button';
import DataCount from '@dods-ui/components/DataCount';
import Icon from '@dods-ui/components/Icon';
import { Icons } from '@dods-ui/components/Icon/assets';
import Pagination from '@dods-ui/components/Pagination';
import RepositoryTable, { RepositoryRowData } from '@dods-ui/components/RepositoryTable';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import useDebounce from '@dods-ui/lib/useDebounce';
import {
  EditorialRecordListResponse,
  MetadataSelection,
} from '@dods-ui/pages/editorial/editorial.models';
import {
  deleteEditorialRecord,
  getMetadataSelections,
  getRecords,
} from '@dods-ui/pages/editorial/editorial.service';
import { toQueryString } from '@dods-ui/utils/api';
import { add, format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

import * as Styled from './index.page.styles';

interface EditorialProps extends LoadingHOCProps {}
interface Filters {
  contentSource?: string;
  informationType?: string;
  searchQuery?: string;
  date?: string;
  status?: string;
  itemsPerPage?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: string;
}

export const Editorial: React.FC<EditorialProps> = ({ setLoading, addNotification }) => {
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({});
  const [editorialRecords, setEditorialRecords] = useState<EditorialRecordListResponse>();
  const [editorialData, setEditorialData] = useState<RepositoryRowData[]>([]);
  const [total, setTotal] = React.useState<number>(0);
  const [selectFilterValues, setSelectFilterValues] = useState<MetadataSelection>({
    contentSources: [],
    informationTypes: [],
    status: [],
  });
  const debouncedValue = useDebounce<string>(filters.searchQuery as string, 850);
  const router = useRouter();

  const { activePage, numPerPage, PaginationButtons, PaginationStats } = Pagination(total);

  const getFilterQueryString = () => {
    const params: Filters = {
      sortBy: 'creationDate',
      sortDirection: 'desc',
      limit: numPerPage,
      offset: activePage * numPerPage,
      ...(filters?.contentSource && { contentSource: encodeURI(filters?.contentSource) }),
      ...(filters.informationType && { informationType: filters.informationType }),
      ...(filters.status && { status: filters.status }),
      ...(filters.searchQuery && { searchTerm: filters.searchQuery }),

      ...(filters.date && { startDate: format(new Date(filters.date), 'yyyy-MM-dd') }),
      ...(filters.date && {
        endDate: format(add(new Date(filters.date), { days: 1 }), 'yyyy-MM-dd'),
      }),
    };

    return toQueryString(params);
  };

  useEffect(() => {
    const getEditorialRecords = async () => {
      const queryString = getFilterQueryString();
      setLoading(true);
      await getRecords(queryString)
        .then((response) => {
          setEditorialRecords(response);
          setTotal(response?.data?.filteredRecords || 0);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getEditorialRecords();
  }, [
    debouncedValue,
    filters.contentSource,
    filters.informationType,
    filters.status,
    filters.date,
    numPerPage,
    activePage,
  ]);

  useEffect(() => {
    if (editorialRecords?.data?.results?.length) {
      const data: RepositoryRowData[] = editorialRecords.data.results.map(
        ({ uuid, documentName, status, updatedAt, assignedEditor }) => ({
          id: uuid,
          documentName,
          status: status?.status || 'draft',
          updated: updatedAt,
          assignedEditor: assignedEditor?.fullName,
        }),
      );
      setEditorialData(data);
    } else {
      setEditorialData([]);
    }
  }, [editorialRecords]);

  const navigateToViewDocument = useCallback((uuid) => {
    router.push(`/library/document/${uuid}?preview=true`);
  }, []);

  const navigateToEditDocument = useCallback((uuid) => {
    router.push(`/editorial/article/${uuid}`);
  }, []);

  const onDeleteDocument = useCallback(async (uuid) => {
    setLoading(true);
    await deleteEditorialRecord(uuid)
      .then(() => {
        addNotification({ title: 'Record deleted', type: 'confirm' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addFilters = (newFilters: Filters) => setFilters({ ...filters, ...newFilters });

  const removeFilter = (filterKey: keyof Filters) => {
    // eslint-disable-next-line no-prototype-builtins
    if (filters.hasOwnProperty(filterKey)) delete filters[filterKey];
    setFilters({ ...filters });
  };
  const onFilterChange = (filter: keyof Filters, value: string) => {
    value ? addFilters({ [filter]: value }) : removeFilter(filter);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const filterValues = await getMetadataSelections();
      setSelectFilterValues(filterValues as MetadataSelection);
      setLoading(false);
    })();
  }, []);

  return (
    <div data-testid="page-editorial">
      <Head>
        <title>Dods | Editorial Repository</title>
      </Head>
      <Panel bgColor={color.base.ivory}>
        <Breadcrumbs
          history={[
            { href: '/', label: 'Dods' },
            { href: '/editorial', label: 'Editorial Repository' },
          ]}
        />
        <Spacer size={6} />
        <Styled.row>
          <Text type="h1" headingStyle="hero">
            Editorial Repository
          </Text>
          <Spacer size={9} />
          <Button
            icon={Icons.Add}
            iconAlignment="left"
            inline
            onClick={() => router.push('editorial/article')}
            width="auto"
            isSmall={true}
            label="Create Content"
          />
        </Styled.row>
        <Spacer size={12} />

        <Styled.row>
          <Styled.filterToggle
            data-test="filter-toggle"
            onClick={() => setIsActiveFilter(!isActiveFilter)}
          >
            <Text type="bodySmall" bold uppercase color={color.base.black}>
              Filter
            </Text>
            <Icon
              src={isActiveFilter ? Icons.ChevronUpBold : Icons.ChevronDownBold}
              color={color.theme.blueMid}
            />
          </Styled.filterToggle>

          <DataCount total={editorialData.length} />
        </Styled.row>

        <Spacer size={6} />

        {isActiveFilter && (
          <Styled.filters data-test="filter-content">
            <SearchDropdown
              testId="editorial-content-source-filter"
              size={'medium'}
              id={'content-source-filter'}
              placeholder="Content source"
              value={filters.contentSource || ''}
              selectedValues={[filters.contentSource || '']}
              values={selectFilterValues.contentSources}
              onChange={(value) => onFilterChange('contentSource', value)}
              isFilter
            />
            <SearchDropdown
              testId="editorial-info-type-filter"
              size={'medium'}
              id={'info-type'}
              value={filters.informationType || ''}
              selectedValues={[filters.informationType || '']}
              placeholder="Information type"
              values={selectFilterValues.informationTypes}
              onChange={(value) => onFilterChange('informationType', value)}
              isFilter
            />
            <SearchDropdown
              testId="editorial-status-filter"
              size={'medium'}
              id={'status'}
              value={filters.status || ''}
              selectedValues={[filters.status || '']}
              placeholder="Status"
              values={selectFilterValues.status}
              onChange={(value) => onFilterChange('status', value)}
              isFilter
            />
            <div />
            <InputSearch
              id="search-filter"
              onChange={(value) => onFilterChange('searchQuery', value)}
              value={filters.searchQuery || ''}
              size="medium"
            />
          </Styled.filters>
        )}

        <Spacer size={3} />
        <hr />
        <Spacer size={3} />
        <main>
          <Spacer size={7} />

          <Box size={'small'}>
            <Styled.row>
              <Styled.tableHeader>
                <Text type="h2" headingStyle="titleLarge">
                  Repository Content
                </Text>
              </Styled.tableHeader>
              <Styled.dateFilter>
                <DatePicker
                  id={'dateFilter'}
                  value={filters.date || ''}
                  onChange={(value) => onFilterChange('date', value)}
                  placeholder={'filter by date'}
                  size={'medium'}
                />
              </Styled.dateFilter>
            </Styled.row>
            <Spacer size={7} />
            <RepositoryTable
              data={editorialData}
              onView={navigateToViewDocument}
              onDelete={onDeleteDocument}
              onEdit={navigateToEditDocument}
            />
            <Spacer size={4} />
            <PaginationStats>
              <PaginationButtons />
            </PaginationStats>
          </Box>
        </main>
      </Panel>
    </div>
  );
};

export default LoadingHOC(Editorial);
