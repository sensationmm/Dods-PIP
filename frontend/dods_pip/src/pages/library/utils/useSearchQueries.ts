import { IDateRange } from '@dods-ui/components/DateFacet';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { BucketType, QueryObject } from '../index';

export enum AggTypes {
  contentSource = 'contentSource',
  jurisdiction = 'jurisdiction',
  informationType = 'informationType',
  topics = 'topics',
  people = 'people',
  organizations = 'organizations',
  geography = 'geography',
  originator = 'originator',
  organisationName = 'organisationName',
  group = 'group',
}

interface IUseSearch {
  setKeywordQuery: (searchTerm: string) => void;
  setCurrentPageQuery: (currentPage: number) => void;
  setResultSize: (resultSize: number) => void;
  setBasicQuery: ({ key, value }: { key: AggTypes; value: string }) => void;
  unsetBasicQuery: (queries: BucketType[]) => void;
  setNestedQuery: ({ path, key, value }: { path: string; key: string; value: string }) => void;
  unsetNestedQuery: (queries: BucketType[]) => void;
  setDateQuery: ({ min, max }: IDateRange) => void;
}

const useSearchQueries = (currentQuery: QueryObject): IUseSearch => {
  const router = useRouter();

  const setQuery = useCallback((query: QueryObject) => {
    router.push(
      {
        pathname: '/library',
        query: { search: JSON.stringify(query) },
      },
      undefined,
      { scroll: false },
    );
  }, []);

  const setKeywordQuery = useCallback(
    (searchTerm: string) => {
      setQuery({ searchTerm, currentPage: 1 });
    },
    [setQuery],
  );

  const setCurrentPageQuery = useCallback(
    (currentPage: number) => {
      const newQuery = { ...currentQuery, currentPage };
      setQuery(newQuery);
    },
    [currentQuery],
  );

  const setBasicQuery = useCallback(
    ({ key, value }: { key: AggTypes; value: string }) => {
      const { basicFilters = [] } = currentQuery;
      const selectedIndex = basicFilters.findIndex(
        (filter) => filter.key === key && filter.value === value,
      );

      let newBasicFilters = [...basicFilters];

      if (selectedIndex > -1) {
        newBasicFilters.splice(selectedIndex, 1); // remove
      } else {
        newBasicFilters = [...basicFilters, { key, value }]; // add
      }

      const newQuery = { ...currentQuery, basicFilters: newBasicFilters, currentPage: 1 };

      setQuery(newQuery);
    },
    [currentQuery],
  );

  const unsetBasicQuery = useCallback(
    (queries: BucketType[]) => {
      const { basicFilters = [] } = currentQuery;

      const newBasicFilters = basicFilters.filter(({ value }) => {
        return !queries.find(({ key }) => value === key);
      });

      const newQuery = { ...currentQuery, basicFilters: newBasicFilters, currentPage: 1 };
      setQuery(newQuery);
    },
    [currentQuery],
  );

  const setNestedQuery = useCallback(
    ({ path, key, value }: { path: string; key: string; value: string }) => {
      const { nestedFilters = [] } = currentQuery;

      const selectedIndex = nestedFilters.findIndex(
        (filter) => filter.key === key && filter.value === value,
      );

      let newNestedFilters = [...nestedFilters];

      if (selectedIndex > -1) {
        // remove
        newNestedFilters.splice(selectedIndex, 1);
      } else {
        // add
        newNestedFilters = [...nestedFilters, { path, key, value }];
      }

      const newQuery = { ...currentQuery, nestedFilters: newNestedFilters, currentPage: 1 };

      setQuery(newQuery);
    },
    [currentQuery],
  );

  const unsetNestedQuery = useCallback(
    (queries: BucketType[]) => {
      const { nestedFilters = [] } = currentQuery;

      const newNestedFilters = nestedFilters.filter(({ value }) => {
        return !queries.find(({ key }) => value === key);
      });

      const newQuery = { ...currentQuery, nestedFilters: newNestedFilters, currentPage: 1 };
      setQuery(newQuery);
    },
    [currentQuery],
  );

  const setDateQuery = useCallback(
    ({ min, max }: IDateRange) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dateRange, ...rest } = currentQuery; // Remove dateRage

      let newQuery: QueryObject = rest;

      if (min && max) {
        newQuery = { ...rest, dateRange: { min, max }, currentPage: 1 };
      }

      setQuery(newQuery);
    },
    [currentQuery],
  );

  const setResultSize = useCallback(
    (resultSize: number) => {
      const newQuery = { ...currentQuery, resultSize, currentPage: 1 };
      setQuery(newQuery);
    },
    [currentQuery],
  );

  return {
    setKeywordQuery,
    setCurrentPageQuery,
    setResultSize,
    setBasicQuery,
    unsetBasicQuery,
    setNestedQuery,
    unsetNestedQuery,
    setDateQuery,
  };
};

export default useSearchQueries;
