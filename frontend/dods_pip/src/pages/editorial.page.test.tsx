import React from 'react';

import { useRouter } from 'next/router';
import fetchJson from '../lib/fetchJson';
import { act, cleanup, render, RenderResult, waitFor } from '@testing-library/react';
import { Editorial } from './editorial.page';
import { Api, BASE_URI } from '../utils/api';

const mockRouterPushFn = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: mockRouterPushFn,
  })),
}));

jest.mock('../lib/fetchJson', () => jest.fn());

const useRouterMock = useRouter as jest.Mock;
const fetchJsonMock = fetchJson as jest.Mock;

const API_CONTENT_SOURCES = `${BASE_URI}${Api.EditorialContentSources}`;
const API_INFO_TYPES = `${BASE_URI}${Api.EditorialInfoTypes}`;
const API_STATUS = `${BASE_URI}${Api.EditorialStatus}`;
const API_RECORDS = `${BASE_URI}${Api.EditorialRecords}`;

const TEST_ID_FILTER_CONTENT_SOURCE = 'editorial-content-source-filter';
const TEST_ID_FILTER_INFO_TYPE = 'editorial-info-type-filter';
const TEST_ID_FILTER_STATUS = 'editorial-status-filter';

const TEXT_SELECTOR_CONTENT_BTN = 'Content Create';

describe('Editorial page', () => {
  jest.useFakeTimers();
  let component: RenderResult;

  beforeEach(async () => {
    fetchJsonMock
      .mockResolvedValueOnce([{ contentSources: { name: 'test source', id: '56fdfghnfgndr456' } }])
      .mockResolvedValueOnce([{ informationType: { name: 'test information type', id: 'd7eg8' } }])
      .mockResolvedValueOnce([{ status: { name: 'test status', uuid: '56sdfbf7vg7eg8' } }]);

    await act(async () => {
      component = render(
        <Editorial {...{ isLoading: false, setLoading: jest.fn(), addNotification: jest.fn() }} />,
      );

      await component.findByTestId('page-editorial');
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('requests select filter values on load', async () => {
    expect(fetchJsonMock).toHaveBeenCalledWith(`${API_CONTENT_SOURCES}`, { method: 'GET' });
    expect(fetchJsonMock).toHaveBeenCalledWith(`${API_CONTENT_SOURCES}`, { method: 'GET' });
    expect(fetchJsonMock).toHaveBeenCalledWith(`${API_CONTENT_SOURCES}`, { method: 'GET' });
  });
});
