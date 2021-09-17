import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../components/Icon';
import { Icons } from '../../components/Icon/assets';

import { Accounts } from './accounts.page';

describe('Account Management: Clients', () => {
  let wrapper;

  const setLoadingSpy = jest.fn();
  const setStateshowFilter = jest.fn();
  const setStatefilterSearchText = jest.fn();
  const setStatefilterAZ = jest.fn();
  const setStatefilterSubscription = jest.fn();
  const setStatefilterLocation = jest.fn();
  const setStatefilterIncomplete = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    showFilter: true,
    filterSearchText: '',
    filterAZ: '',
    filterSubscription: '',
    filterLocation: '',
  };

  const states = [
    defaultState, // renders without error
    { ...defaultState, showFilter: false }, // renders with closed filter
    defaultState, // toggles filter view
    { ...defaultState, filterSearchText: 'anot' }, // filters by search box
    { ...defaultState, filterAZ: 'M' }, // filters by a-z
    { ...defaultState, filterSubscription: 'level2' }, // filters by subscription
    { ...defaultState, filterLocation: 'europe' }, // filters by location
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].showFilter, setStateshowFilter])
      .mockImplementationOnce(() => [states[count].filterSearchText, setStatefilterSearchText])
      .mockImplementationOnce(() => [states[count].filterAZ, setStatefilterAZ])
      .mockImplementationOnce(() => [states[count].filterSubscription, setStatefilterSubscription])
      .mockImplementationOnce(() => [states[count].filterLocation, setStatefilterLocation])
      .mockImplementationOnce(() => [0, jest.fn]) //Pagination component setState calls
      .mockImplementationOnce(() => [30, jest.fn]); //Pagination component setState calls

    wrapper = shallow(<Accounts isLoading={false} setLoading={setLoadingSpy} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="page-account-management-clients"]');
    const filterToggleIcon = wrapper.find('[data-test="filter-toggle"]').find(Icon);
    const filterContent = wrapper.find('[data-test="filter-content"]');
    expect(component.length).toEqual(1);
    expect(filterToggleIcon.props().src).toEqual(Icons.IconChevronUp);
    expect(filterContent.props().open).toEqual(true);
  });

  it('renders with closed filter', () => {
    const filterToggleIcon = wrapper.find('[data-test="filter-toggle"]').find(Icon);
    const filterContent = wrapper.find('[data-test="filter-content"]');
    expect(filterToggleIcon.props().src).toEqual(Icons.IconChevronDown);
    expect(filterContent.props().open).toEqual(false);
  });

  it('toggles filter view', () => {
    const filterToggle = wrapper.find('[data-test="filter-toggle"]');
    expect(filterToggle.length).toEqual(1);
    filterToggle.simulate('click');
    expect(setStateshowFilter).toHaveBeenCalledWith(false);
  });

  it('filters by search box', () => {
    const itemsCount = wrapper.find('[data-test="items-count"]');
    expect(itemsCount.text()).toEqual('4');
  });

  it('filters by a-z', () => {
    const itemsCount = wrapper.find('[data-test="items-count"]');
    expect(itemsCount.text()).toEqual('8');
  });

  it('filters by subscription', () => {
    const itemsCount = wrapper.find('[data-test="items-count"]');
    expect(itemsCount.text()).toEqual('9');
  });

  it('filters by location', () => {
    const itemsCount = wrapper.find('[data-test="items-count"]');
    expect(itemsCount.text()).toEqual('13');
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});