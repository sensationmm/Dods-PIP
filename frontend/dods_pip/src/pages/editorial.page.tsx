import Head from 'next/head';
import React, { useEffect, useState } from 'react';

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
import fetchJson from '../lib/fetchJson';
import MockEditorialData from '../mocks/data/repository.json';
import { Api, BASE_URI } from '../utils/api';
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

type filterValue = Record<selectFilter, { label: string; value: string }[]>;
type selectFilter = 'contentSources' | 'informationTypes' | 'status';

export const Editorial: React.FC<EditorialProps> = ({ setLoading }) => {
  const [isActiveFilter, setIsActiveFilter] = useState<boolean>(true);
  const [filters, setFilters] = useState<Filters>({});

  const [selectFilterValues, setSelectFilterValues] = useState<filterValue>({
    contentSources: [],
    informationTypes: [],
    status: [],
  });

  const editorialData = MockEditorialData.data as unknown as RepositoryTableProps['data'];

  const addFilters = (newFilters: Filters) => setFilters({ ...filters, ...newFilters });
  const removeFilter = (filterKey: keyof Filters) => {
    // eslint-disable-next-line no-prototype-builtins
    if (filters.hasOwnProperty(filterKey)) delete filters[filterKey];
    setFilters({ ...filters });
  };
  const onFilterChange = (filter: keyof Filters, value: string) => {
    value ? addFilters({ [filter]: value }) : removeFilter(filter);
  };

  const getFilterValues = async (): Promise<filterValue[]> => {
    setLoading(true);
    try {
      const dataSources = await Promise.all([
        fetchJson(`${BASE_URI}${Api.EditorialContentSources}`, { method: 'GET' }),
        fetchJson(`${BASE_URI}${Api.EditorialInfoTypes}`, { method: 'GET' }),
        fetchJson(`${BASE_URI}${Api.EditorialStatus}`, { method: 'GET' }),
      ]);
      setLoading(false);

      return (['contentSources', 'informationTypes', 'status'] as selectFilter[]).map((type) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const valuesFromDataSource: Record<string, any> | undefined = dataSources.find((value) =>
          // eslint-disable-next-line no-prototype-builtins
          value.hasOwnProperty(type),
        );

        if (!valuesFromDataSource) return;

        return {
          [type]: valuesFromDataSource[type].map((data: Record<string, string>) => {
            return { label: data.name, value: data.uuid || data.id };
          }),
        };
      }) as filterValue[];
    } catch (e) {
      console.log(e);
      setLoading(false);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      const filterValues = await getFilterValues();
      let _values = {};
      filterValues.forEach((values) => {
        _values = { ..._values, ...values };
      });

      setSelectFilterValues(_values as filterValue);
    })();
  }, []);

  return (
    <div data-testid="page-editorial">
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
          <Spacer size={9} />
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
                placeholder="Browse information type"
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
            <RepositoryTable data={editorialData} onDelete={console.log} onEdit={console.log} />
          </Box>
        </main>
      </Panel>
    </div>
  );
};

export default LoadingHOC(Editorial);
