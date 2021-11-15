
// @ts-nocheck
import React from 'react';
import { cleanup, render, RenderResult, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddClient from './add-client';
import fetchJson from '../../../lib/fetchJson';
import { mockClientData } from '../mockAccountData';

const mockRouterPushFn = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: mockRouterPushFn,
  })),
}));

jest.mock('../../../lib/fetchJson', () => jest.fn());

const fetchJsonMock = fetchJson as jest.Mock;

window.scrollTo = jest.fn();

const componentSuccessfulRender = async (instance: RenderResult) =>
  await instance.findAllByTestId('page-account-management-add-client');

const renderComponentWithData = async (
  props = {},
  accountData: {} | 'fail' = mockClientData.data[0],
): Promise<RenderResult> => {
  accountData === 'fail'
    ? fetchJsonMock.mockReturnValueOnce({})
    : fetchJsonMock.mockResolvedValueOnce({ success: true, data: accountData });
 
  const renderer = render(
    <AddClient {...{ isLoading: false, setLoading: jest.fn(), addNotification: jest.fn(), ...props }} />,
  );

  await componentSuccessfulRender(renderer);

  return renderer;
};

const SELECTOR = {
  step1: '[data-test="account-info"]',
  step2: '[data-test="subscription"]',
  step3: '[data-test="team"]',
}

describe('AddClient component', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders step 1', async() => {
    const render = await renderComponentWithData({ accountId: '', activeStep: 1, editMode: false });
    const $step1 = render.container.querySelector(SELECTOR.step1);
    const $step2 = render.container.querySelector(SELECTOR.step2);
    const $step3 = render.container.querySelector(SELECTOR.step3);

    expect($step1).not.toBeNull();
    expect($step2).toBeNull();
    expect($step3).toBeNull();
  });

  it('renders step 2', async() => {
    const render = await renderComponentWithData({ accountId: '', activeStep: 2, editMode: false });
    const $step1 = render.container.querySelector(SELECTOR.step1);
    const $step2 = render.container.querySelector(SELECTOR.step2);
    const $step3 = render.container.querySelector(SELECTOR.step3);

    expect($step1).toBeNull();
    expect($step2).not.toBeNull();
    expect($step3).toBeNull();
  });

  it('renders step 3', async() => {
    const render = await renderComponentWithData({ accountId: '', activeStep: 3, editMode: false });
    const $step1 = render.container.querySelector(SELECTOR.step1);
    const $step2 = render.container.querySelector(SELECTOR.step2);
    const $step3 = render.container.querySelector(SELECTOR.step3);

    expect($step1).toBeNull();
    expect($step2).toBeNull();
    expect($step3).not.toBeNull();
  });
  
  it('when editMode = true, use initialState (no server request to load account), renders step 1 ', async() => {
    const render = await renderComponentWithData({ accountId: mockClientData.data[0].uuid, activeStep: 1, initialState: mockClientData.data[0],  editMode: true });
    const $step1 = render.container.querySelector(SELECTOR.step1);

    expect($step1).not.toBeNull();
  });
});