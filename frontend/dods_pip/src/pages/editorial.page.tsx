import Head from 'next/head';
import React, { useState } from 'react';

import DatePicker from '../components/_form/DatePicker';
import InputSearch from '../components/_form/InputSearch';
import SearchDropdown from '../components/_form/SearchDropdown';
import Box from '../components/_layout/Box';
import Panel from '../components/_layout/Panel';
import Spacer from '../components/_layout/Spacer';
import Breadcrumbs from '../components/Breadcrumbs';
import Button from '../components/Button';
import DataCount from '../components/DataCount';
import Icon from '../components/Icon';
import { Icons } from '../components/Icon/assets';
import RepositoryTable, { RepositoryTableProps } from '../components/RepositoryTable';
import Text from '../components/Text';
import color from '../globals/color';
import LoadingHOC, { LoadingHOCProps } from '../hoc/LoadingHOC';
import MockEditorialData from '../mocks/data/repository.json';
import * as Styled from './editorial.page.styles';

interface EditorialProps extends LoadingHOCProps {}
interface Filters {
  contentSource?: string;
  informationType?: string;
  searchQuery?: string;
  date?: string;
  status?: string;
  itemsPerPage?: number;
}

export enum EditorialStatus {
  Ingested = 'ingested',
  Draft = 'draft',
  Scheduled = 'scheduled',
  InProgress = 'in progress',
  Published = 'published',
}

export const Editorial: React.FC<EditorialProps> = () => {
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({});
  const editorialData = MockEditorialData.data as unknown as RepositoryTableProps['data'];
  const statusValues = Object.values(EditorialStatus).map((value) => ({ label: value, value }));
  const contentSourceValues = [1, 2, 3, 4, 5, 6].map((index) => ({
    label: `source ${index}`,
    value: `source${index}`,
  }));
  const infoTypeValues = [1, 2, 3, 4, 5, 6].map((index) => ({
    label: `type ${index}`,
    value: `type${index}`,
  }));

  const addFilters = (newFilters: Filters) => setFilters({ ...filters, ...newFilters });
  const removeFilter = (filterKey: keyof Filters) => {
    // eslint-disable-next-line no-prototype-builtins
    if (filters.hasOwnProperty(filterKey)) delete filters[filterKey];
    setFilters({ ...filters });
  };
  const onFilterChange = (filter: keyof Filters, value: string) => {
    value ? addFilters({ [filter]: value }) : removeFilter(filter);
  };

  return (
    <div data-test="page-home">
      <Head>
        <title>Dods PIP | Editorial Repository</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Panel bgColor={color.base.greyLighter}>
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
          <Button
            icon={Icons.Add}
            iconAlignment="left"
            inline
            onClick={() => alert('Page URL does not yet exist')}
            width="auto"
            isSmall={true}
            label="Create Content"
          />
        </Styled.row>
        <Spacer size={12} />

        <div id={'TO-BE-REMOVED'}>
          TEMPORARY DEBUGGING WHILE API SERVICES ARE NOT AVAILABLE
          <br />
          <br />
          {JSON.stringify(filters)}
          <br />
          <br />
        </div>

        <div>
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
                  size={'medium'}
                  id={'content-source-filter'}
                  placeholder="Content source"
                  selectedValues={[filters.contentSource || '']}
                  values={contentSourceValues}
                  onChange={(value) => onFilterChange('contentSource', value)}
                />
                <SearchDropdown
                  size={'medium'}
                  id={'info-type'}
                  selectedValues={[filters.informationType || '']}
                  placeholder="Browse information type"
                  values={infoTypeValues}
                  onChange={(value) => onFilterChange('informationType', value)}
                />
                <SearchDropdown
                  size={'medium'}
                  id={'status'}
                  selectedValues={[filters.status || '']}
                  placeholder="Status"
                  values={statusValues}
                  onChange={(value) => onFilterChange('status', value)}
                />
              </Styled.column>

              <div>
                <InputSearch
                  id="search-filter"
                  onChange={(value) => onFilterChange('searchQuery', value)}
                  value={filters.searchQuery || ''}
                  size="medium"
                />
              </div>
            </Styled.row>
          )}
        </div>
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
                  label={'filter by date'}
                  size={'medium'}
                />
              </Styled.dateFilter>
            </Styled.row>
            <Spacer size={7} />
            <RepositoryTable data={editorialData} onDelete={console.log} onEdit={console.log} />
          </Box>
        </main>
      </Panel>
    </div>
  );
};

export default LoadingHOC(Editorial);
