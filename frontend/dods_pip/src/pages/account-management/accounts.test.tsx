import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';

import { Accounts } from './accounts.page';

const mockRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest
    .fn()
    .mockReturnValueOnce({ push: (arg) => mockRouterPush(arg), query: {} })
    .mockReturnValue({ push: (arg) => mockRouterPush(arg), query: { code: 'abc' } }),
}));

jest.mock('../../lib/useSubscriptionTypes', () => {
  return jest
    .fn()
    .mockReturnValue({ subscriptionList: mockSubscriptionList })
});

const mockTeamClient = [,
  { id: '110', name: 'John Doe', type: 'client'},
  { id: '111', name: 'John Doe 2', type: 'client'},
  { id: '112', name: 'John Smith', type: 'client'},
  { id: '113', name: 'John Smith 2', type: 'client'},
  { id: '114', name: 'John Smith 3', type: 'client'},
];

const mockTeamConsultant = [,
  { id: '120', name: 'Jane Doe', type: 'consultant'},
  { id: '121', name: 'Jane Doe 2', type: 'consultant'},
  { id: '122', name: 'Jane Smith', type: 'consultant'},
  { id: '123', name: 'Jane Smith 2', type: 'consultant'},
  { id: '124', name: 'Jane Smith 3', type: 'consultant'},
];

const mockTeam = [
  ...mockTeamConsultant,
  ...mockTeamClient
];

const mockResponse = {
  search: [ { uuid: '10', name: 'Foo 1', projects: 0, team: [], isCompleted: false }, { uuid: '11', name: 'Somo', projects: 2, team: mockTeamClient, isCompleted: true }],
  filterAZ: [ { uuid: '20', name: 'Foo 2', projects: 2, team: [], isCompleted: false }, { uuid: '21', name: 'Somo', projects: 1, team: mockTeam, isCompleted: true }],
  location: [ { uuid: '30', name: 'Foo 3', projects: 2, team: mockTeam, isCompleted: true }, { uuid: '31', name: 'Somo', projects: 2, team: mockTeamConsultant, isCompleted: true }],
  subscription: [ { uuid: '40', name: 'Foo 4', projects: 0, team: [], isCompleted: false }, { uuid: '41', name: 'Somo', projects: 4, team: mockTeam, isCompleted: true }],
};

jest.mock('../../lib/fetchJson', () => {
  return jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse.search, totalRecords: mockResponse.search.length }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse.filterAZ, totalRecords: mockResponse.filterAZ.length }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse.location, totalRecords: mockResponse.location.length }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse.location, totalRecords: mockResponse.location.length }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse.subscription, totalRecords: mockResponse.subscription.length }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse.subscription, totalRecords: mockResponse.subscription.length }),
    )
    .mockImplementationOnce(() =>
      Promise.resolve({ data: mockResponse.subscription, totalRecords: mockResponse.subscription.length }),
    )
    .mockImplementation(() =>
      Promise.resolve({ data: [], totalRecords: 0 })
    )
});

describe('Account Management: Clients', () => {
  let wrapper;

  const setLoadingSpy = jest.fn();
  const setStateshowFilter = jest.fn();
  const setStateAccountsList = jest.fn();
  const setStatefilterSearchText = jest.fn();
  const setStatefilterAZ = jest.fn();
  const setStatefilterSubscription = jest.fn();
  const setStatefilterLocation = jest.fn();
  const setStatefilterAccount = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    accountsList: [],
    totalRecords: 0,
    showFilter: true,
    filterSearchText: '',
    filterAZ: '',
    filterSubscription: '',
    filterLocation: '',
    filterAccount: '',
  };

  const states = [
    { ...defaultState, filterSearchText: 'anot' }, // filters by search box
    { ...defaultState, filterAZ: 'M' }, // filters by a-z
    { ...defaultState, filterLocation: 'eu' }, // filters by location (eu)
    { ...defaultState, filterLocation: 'uk' }, // filters by location (uk)
    { ...defaultState, filterSubscription: '2' }, // filters by subscription
    { ...defaultState, filterAccount: 'incomplete' }, // filters by account (incomplete)
    { ...defaultState, filterAccount: 'completed' }, // filters by account (completed)
    defaultState, // when accountsList is empty, renders without error
    { ...defaultState, accountsList: mockResponse.subscription, totalRecord: 2 }, // when accountsList is not empty, renders without error (branch code 1)
    { ...defaultState, accountsList: mockResponse.search, totalRecord: 2 }, // when accountsList is not empty, renders without error (branch code 2)
    { ...defaultState, accountsList: mockResponse.location, totalRecord: 2 }, // when accountsList is not empty, renders without error (branch code 3)
    { ...defaultState, showFilter: false }, // renders with closed filter
    defaultState, // toggles filter view
    defaultState, // navigates to create client flow
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].showFilter, setStateshowFilter])
      .mockImplementationOnce(() => [states[count].filterSearchText, setStatefilterSearchText])
      .mockImplementationOnce(() => [states[count].filterAZ, setStatefilterAZ])
      .mockImplementationOnce(() => [states[count].filterAccount, setStatefilterAccount])
      .mockImplementationOnce(() => [states[count].filterSubscription, setStatefilterSubscription])
      .mockImplementationOnce(() => [states[count].filterLocation, setStatefilterLocation])
      .mockImplementationOnce(() => [states[count].accountsList, setStateAccountsList])
      .mockImplementationOnce(() => [0, jest.fn]) //Pagination component setState calls
      .mockImplementationOnce(() => [30, jest.fn]); //Pagination component setState calls

    wrapper = shallow(
      <Accounts isLoading={false} setLoading={setLoadingSpy} addNotification={jest.fn} />,
    );
  });

  it('filters by search box', () => {
    expect(setStateAccountsList).toHaveBeenCalledWith(mockResponse.search);
    expect(setLoadingSpy).toHaveBeenCalledTimes(2);
  });

  it('filters by a-z', () => {
    expect(setStateAccountsList).toHaveBeenCalledWith(mockResponse.filterAZ);
    expect(setLoadingSpy).toHaveBeenCalledTimes(2);
  });

  it('filters by location (eu)', () => {
    expect(setStateAccountsList).toHaveBeenCalledWith(mockResponse.location);
    expect(setLoadingSpy).toHaveBeenCalledTimes(2);
  });

  it('filters by location (uk)', () => {
    expect(setStateAccountsList).toHaveBeenCalledWith(mockResponse.location);
    expect(setLoadingSpy).toHaveBeenCalledTimes(2);
  });

  it('filters by subscription', () => {
    expect(setStateAccountsList).toHaveBeenCalledWith(mockResponse.subscription);
    expect(setLoadingSpy).toHaveBeenCalledTimes(2);
  });

  it('filters by account (incomplete)', () => {
    expect(setStateAccountsList).toHaveBeenCalledWith(mockResponse.subscription);
    expect(setLoadingSpy).toHaveBeenCalledTimes(2);
  });

  it('filters by account (completed)', () => {
    expect(setStateAccountsList).toHaveBeenCalledWith(mockResponse.subscription);
    expect(setLoadingSpy).toHaveBeenCalledTimes(2);
  });

  it('when accountsList is empty, renders without error', () => {
    const component = wrapper.find('[data-test="page-account-management-clients"]');
    const filterToggleIcon = wrapper.find('[data-test="filter-toggle"]').find(Icon);
    const filterContent = wrapper.find('[data-test="filter-content"]');
    expect(component.length).toEqual(1);
    expect(filterToggleIcon.props().src).toEqual(Icons.ChevronUpBold);
    expect(filterContent.props().open).toEqual(true);
  });

  it('when accountsList is not empty, renders without error (branch code 1)', () => {
    const component = wrapper.find('[data-test="page-account-management-clients"]');
    const filterToggleIcon = wrapper.find('[data-test="filter-toggle"]').find(Icon);
    const filterContent = wrapper.find('[data-test="filter-content"]');
    expect(component.length).toEqual(1);
    expect(filterToggleIcon.props().src).toEqual(Icons.ChevronUpBold);
    expect(filterContent.props().open).toEqual(true);
  });

  it('when accountsList is not empty, renders without error (branch code 2)', () => {
    const component = wrapper.find('[data-test="page-account-management-clients"]');
    const filterToggleIcon = wrapper.find('[data-test="filter-toggle"]').find(Icon);
    const filterContent = wrapper.find('[data-test="filter-content"]');
    expect(component.length).toEqual(1);
    expect(filterToggleIcon.props().src).toEqual(Icons.ChevronUpBold);
    expect(filterContent.props().open).toEqual(true);
  });

  it('when accountsList is not empty, renders without error (branch code 3)', () => {
    const component = wrapper.find('[data-test="page-account-management-clients"]');
    const filterToggleIcon = wrapper.find('[data-test="filter-toggle"]').find(Icon);
    const filterContent = wrapper.find('[data-test="filter-content"]');
    expect(component.length).toEqual(1);
    expect(filterToggleIcon.props().src).toEqual(Icons.ChevronUpBold);
    expect(filterContent.props().open).toEqual(true);
  });

  it('renders with closed filter', () => {
    const filterToggleIcon = wrapper.find('[data-test="filter-toggle"]').find(Icon);
    const filterContent = wrapper.find('[data-test="filter-content"]');
    expect(filterToggleIcon.props().src).toEqual(Icons.ChevronDownBold);
    expect(filterContent.props().open).toEqual(false);
  });

  it('toggles filter view', () => {
    const filterToggle = wrapper.find('[data-test="filter-toggle"]');
    expect(filterToggle.length).toEqual(1);
    filterToggle.simulate('click');
    expect(setStateshowFilter).toHaveBeenCalledWith(false);
  });

  it('navigates to create client flow', () => {
    const createClientButton = wrapper.find('[data-test="btn-create-client-account"]');
    createClientButton.simulate('click');
    expect(mockRouterPush).toHaveBeenCalledWith('/account-management/add-client');
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
