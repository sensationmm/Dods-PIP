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
import RepositoryTable, { RepositoryRowData } from '@dods-ui/components/RepositoryTable';
import Text from '@dods-ui/components/Text';
import color from '@dods-ui/globals/color';
import LoadingHOC, { LoadingHOCProps } from '@dods-ui/hoc/LoadingHOC';
import {
  EditorialRecordListResponse,
  MetadataSelection,
} from '@dods-ui/pages/editorial/editorial.models';
import { getMetadataSelections, getRecords } from '@dods-ui/pages/editorial/editorial.service';
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
}

export const Editorial: React.FC<EditorialProps> = ({ setLoading }) => {
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({});
  const [editorialRecords, setEditorialRecords] = useState<EditorialRecordListResponse>();
  const [editorialData, setEditorialData] = useState<RepositoryRowData[]>([]);
  const [selectFilterValues, setSelectFilterValues] = useState<MetadataSelection>({
    contentSources: [],
    informationTypes: [],
    status: [],
  });
  const router = useRouter();

  useEffect(() => {
    const getEditorialRecords = async () => {
      await getRecords().then((response) => {
        setEditorialRecords(response);
      });
    };
    getEditorialRecords();
  }, []);

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
    }
  }, [editorialRecords]);

  const navigateToViewDocument = useCallback((uuid) => {
    router.push(`/library/document/${uuid}`);
  }, []);

  const navigateToEditDocument = useCallback((uuid) => {
    router.push(`/editorial/article/${uuid}`);
  }, []);

  const onDeleteDocument = useCallback((uuid) => {
    // TODO: Archive the Editorial Record
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
        <title>Dods PIP | Editorial Repository</title>
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
          <Styled.row data-test="filter-content">
            <Styled.column>
              <SearchDropdown
                testId="editorial-content-source-filter"
                size={'medium'}
                id={'content-source-filter'}
                placeholder="Content source"
                selectedValues={[filters.contentSource || '']}
                values={selectFilterValues.contentSources}
                onChange={(value) => onFilterChange('contentSource', value)}
              />
              <SearchDropdown
                testId="editorial-info-type-filter"
                size={'medium'}
                id={'info-type'}
                selectedValues={[filters.informationType || '']}
                placeholder="Information type"
                values={selectFilterValues.informationTypes}
                onChange={(value) => onFilterChange('informationType', value)}
              />
              <SearchDropdown
                testId="editorial-status-filter"
                size={'medium'}
                id={'status'}
                selectedValues={[filters.status || '']}
                placeholder="Status"
                values={selectFilterValues.status}
                onChange={(value) => onFilterChange('status', value)}
              />
            </Styled.column>

            <Styled.searchWrapper>
              <InputSearch
                id="search-filter"
                onChange={(value) => onFilterChange('searchQuery', value)}
                value={filters.searchQuery || ''}
                size="medium"
              />
            </Styled.searchWrapper>
          </Styled.row>
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
          </Box>
        </main>
      </Panel>
    </div>
  );
};

export default LoadingHOC(Editorial);
