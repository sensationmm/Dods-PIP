import React from 'react';
import { act, cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {Users} from './users.page';
import { useRouter } from 'next/router';
import fetchJson from '../../lib/fetchJson';
import { mockUsersData } from './mockUsersData';

jest.mock('../../lib/fetchJson', () => jest.fn());

const fetchJsonMock = fetchJson as jest.Mock;

const componentSuccessfulRender = async (instance: RenderResult) =>
  await instance.findAllByTestId('page-account-management-users');

const renderComponentWithData = async (
  userData: {} | 'fail' = mockUsersData
): Promise<RenderResult> => {
  userData === 'fail'
    ? fetchJsonMock.mockReturnValueOnce({})
    : fetchJsonMock.mockResolvedValueOnce(userData);

  const renderer = render(
    <Users {...{ isLoading: false, setLoading: jest.fn(), addNotification: jest.fn() }} />,
  );

  await componentSuccessfulRender(renderer);

  return renderer;
};

const SELECTOR_BREADCRUMBS = '[data-test="component-breadcrumbs"]';

describe('Account Management: User', () => {
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
});
