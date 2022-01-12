import React from 'react';
import { act, cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Accounts } from './accounts.page';
import { useRouter } from 'next/router';
import fetchJson from '../../lib/fetchJson';
import { mockClientData, mockSubscriptionsData } from './mockAccountData';

const mockRouterPushFn = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: mockRouterPushFn,
  })),
}));

jest.mock('../../lib/fetchJson', () => jest.fn());

const useRouterMock = useRouter as jest.Mock;
const fetchJsonMock = fetchJson as jest.Mock;

const componentSuccessfulRender = async (instance: RenderResult) =>
  await instance.findAllByTestId('page-account-management-clients');

const renderComponentWithData = async (
  clientData: {} | 'fail' = mockClientData,
  subscriptionsData: any[] | 'fail' = mockSubscriptionsData,
): Promise<RenderResult> => {
  clientData === 'fail'
    ? fetchJsonMock.mockReturnValueOnce({})
    : fetchJsonMock.mockResolvedValueOnce(clientData);

  subscriptionsData === 'fail'
    ? fetchJsonMock.mockRejectedValueOnce({})
    : fetchJsonMock.mockResolvedValueOnce(subscriptionsData);

  const renderer = render(
    <Accounts {...{ isLoading: false, setLoading: jest.fn(), addNotification: jest.fn() }} />,
  );

  await componentSuccessfulRender(renderer);

  return renderer;
};

const FILTERS_API_PATH = '/api/clientaccount';

const SELECTOR_BREADCRUMBS = '[data-test="component-breadcrumbs"]';
const SELECTOR_SELECT_OPTIONS = '[data-test^="option-"]';
const SELECTOR_ATOZ_FILTER = '[data-test="component-AZFilter"]';
const SELECTOR_ATOZ_FILTER_ALL_BTN = '[data-test="button-all"]';
const TEXT_SELECTOR_CLIENT_BTN = 'Add Account';
const TEST_ID_SUBSCRIPTION_FILTER = 'account-page-subscription-filter';
const TEST_ID_ITEMS_PER_PAGE_FILTER = 'select-items-per-page';
const TEST_ID_ACCOUNT_FILTER = 'account-page-account-filter';
const TEST_ID_FILTER_TOGGLE = 'account-page-filter-toggle';
const TEST_ID_SEARCH = 'account-page-search';
const TEST_ID_FILTER_CONTENT = 'account-page-filter-content';

const SELECT_FILTER_CASES = [
  [
    'subscription',
    TEST_ID_SUBSCRIPTION_FILTER,
    'subscriptionTypes',
    mockSubscriptionsData.map((data, index) => [data.uuid, index + 1]),
  ],
  [
    'account',
    TEST_ID_ACCOUNT_FILTER,
    'isCompleted',
    [
      [true, 1],
      [false, 2],
    ],
  ],
];

describe('Account Management: Clients', () => {
  jest.useFakeTimers();
  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  // TODO: Move following 3 cases to template component once created
  it('should render breadcrumbs', async () => {
    const render = await renderComponentWithData();
    const $breadCrumbs = render.container.querySelector(SELECTOR_BREADCRUMBS);

    expect($breadCrumbs).not.toBeNull();
    expect($breadCrumbs.children).toHaveLength(2);
    expect($breadCrumbs.children[0].querySelector('a')).toHaveAttribute(
      'href',
      '/account-management',
    );
    expect($breadCrumbs.children[1].querySelector('a')).not.toHaveAttribute('href');
  });

  it('render a link to client management page', async () => {
    const render = await renderComponentWithData();
    const $addClientBtn = render.getByText(TEXT_SELECTOR_CLIENT_BTN);

    expect($addClientBtn).not.toBeNull();
    $addClientBtn.click();
    expect(mockRouterPushFn).toHaveBeenCalledWith('/account-management/add-client');
    expect(mockRouterPushFn).toHaveBeenCalledTimes(1);
  });

  it('should render filter toggle', async () => {
    const render = await renderComponentWithData();
    const $filterToggle = render.getByTestId(TEST_ID_FILTER_TOGGLE);

    expect($filterToggle).not.toBeNull();
    expect(render.queryByTestId(TEST_ID_FILTER_CONTENT)).not.toBeNull();

    act(() => $filterToggle.click());
    expect(render.queryByTestId(TEST_ID_FILTER_CONTENT)).toBeNull();

    act(() => $filterToggle.click());
    expect(render.queryByTestId(TEST_ID_FILTER_CONTENT)).not.toBeNull();
  });

  it('requests data on load', async () => {
    await renderComponentWithData();

    expect(fetchJsonMock).toHaveBeenCalledWith(`${FILTERS_API_PATH}?limit=30&offset=0`, {
      method: 'GET',
    });

    expect(fetchJsonMock).toHaveBeenCalledWith('/api/subscription-types', { method: 'GET' });
    expect(fetchJsonMock).toHaveBeenCalledTimes(2);
  });

  describe.each(SELECT_FILTER_CASES)(
    'when the %s filter is changed',
    (name: string, testId: string, filterKey: string, optionsCases: any[]) => {
      let $filter, render, $filterOptions;
      beforeEach(async () => {
        render = await renderComponentWithData();
        $filter = render.getByTestId(testId);
        $filter.click();
        $filterOptions = $filter.querySelectorAll(SELECTOR_SELECT_OPTIONS);
      });

      describe('and value is empty', () => {
        beforeEach(async () => {
          // default value is the first option so we need to change it to trigger change
          act(() => $filterOptions[1].click());
          $filter.click();
          await act(async () => {
            $filterOptions[0].click();
            await componentSuccessfulRender(render);
          });
        });

        it(`should request accounts data without ${name} filter`, () => {
          expect(fetchJsonMock).toHaveBeenLastCalledWith(`${FILTERS_API_PATH}?limit=30&offset=0`, {
            method: 'GET',
          });
        });
      });

      it.each(optionsCases)(
        `should request accounts data with ${name} filter applied`,
        async (expectedValue, index) => {
          await act(async () => {
            $filterOptions[index].click();
            await componentSuccessfulRender(render);
          });

          expect(fetchJsonMock).toHaveBeenCalledWith(
            `${FILTERS_API_PATH}?limit=30&offset=0&${filterKey}=${expectedValue}`,
            { method: 'GET' },
          );
        },
      );
    },
  );

  describe('when search filter value is entered', () => {
    let $input, render;

    beforeEach(async () => {
      render = await renderComponentWithData();
      $input = render.getByTestId(TEST_ID_SEARCH);
    });

    it('should request accounts data with search filter applied', async () => {
      await act(async () => {
        fireEvent.change($input, { target: { value: 'test' } });
        await componentSuccessfulRender(render);
      });

      await waitFor(() =>
        expect(fetchJsonMock).toHaveBeenLastCalledWith(
          `${FILTERS_API_PATH}?limit=30&offset=0&searchTerm=test`,
          {
            method: 'GET',
          },
        ),
      );
    });

    it('should not send request until user has stopped typing', async () => {
      let aggregatedString = '';
      await act(async () => {
        // trigger change for each character
        'testing debounce input'.split('').forEach((char, index, array) => {
          aggregatedString = aggregatedString + char;
          fireEvent.change($input, { target: { value: aggregatedString } });
        });
        await componentSuccessfulRender(render);
      });

      await waitFor(() =>
        expect(fetchJsonMock).toHaveBeenLastCalledWith(
          `${FILTERS_API_PATH}?limit=30&offset=0&searchTerm=testing%20debounce%20input`,
          {
            method: 'GET',
          },
        ),
      );
    });
  });

  describe.each('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => [letter, letter]))(
    'when `%s` is clicked in the alphabet filter',
    (name, letter) => {
      let render, $atozFilter, $filterItem;
      beforeEach(async () => {
        render = await renderComponentWithData();
        $atozFilter = render.container.querySelector(SELECTOR_ATOZ_FILTER);
        $filterItem = $atozFilter.querySelector(`[data-test="button-${letter}"]`);
        $filterItem.click();
        await componentSuccessfulRender(render);
      });

      it(`should request accounts data with A to Z filter`, () => {
        expect(fetchJsonMock).toHaveBeenLastCalledWith(
          `${FILTERS_API_PATH}?limit=30&offset=0&startsWith=${letter}`,
          {
            method: 'GET',
          },
        );
      });
    },
  );

  describe('when `View all` is clicked in the alphabet filter', () => {
    let render, $atozFilter;
    beforeEach(async () => {
      render = await renderComponentWithData();
      $atozFilter = render.container.querySelector(SELECTOR_ATOZ_FILTER);
      $atozFilter.querySelector(SELECTOR_ATOZ_FILTER_ALL_BTN).click();
      await componentSuccessfulRender(render);
    });

    it(`should request accounts data without A to Z filter`, () => {
      expect(fetchJsonMock).toHaveBeenLastCalledWith(`${FILTERS_API_PATH}?limit=30&offset=0`, {
        method: 'GET',
      });
    });
  });

  // TODO: Move test case to template component once created
  describe('when items per page selection is made', () => {
    let $filter, render, $filterOptions;
    beforeEach(async () => {
      render = await renderComponentWithData();
      $filter = render.queryByTestId(TEST_ID_ITEMS_PER_PAGE_FILTER);
      $filter.click();
      $filterOptions = $filter.querySelectorAll(SELECTOR_SELECT_OPTIONS);
    });

    // default value is 3, no need to test (covered in previous cases)
    it.each([
      [10, 0],
      [60, 2],
      [90, 3],
    ])('should request accounts data with paging limit', async (value, index) => {
      await act(async () => {
        $filterOptions[index].click();
        await componentSuccessfulRender(render);
      });

      expect(fetchJsonMock).toHaveBeenLastCalledWith(
        `${FILTERS_API_PATH}?limit=${value}&offset=0`,
        {
          method: 'GET',
        },
      );
    });
  });

  //TODO add cases for datatable item interactions
});
