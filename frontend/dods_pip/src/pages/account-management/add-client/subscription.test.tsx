import { format } from 'date-fns';
import { shallow, mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Subscription from './subscription';

jest.mock('../../../lib/fetchJson', () => {
  return jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve(mockSubscriptionList)
    ).mockImplementationOnce(() =>
      Promise.resolve({ success: true })
    ).mockImplementationOnce(() =>
      Promise.resolve(mockSubscriptionList)
    ).mockImplementationOnce(() =>
      Promise.resolve({ message: 'server error', success: false }),
    ).mockImplementation(() =>
      Promise.resolve(mockSubscriptionList)
    )
});

describe('Subscription', () => {
  let wrapper;

  const setErrors = jest.fn();
  const setValue = jest.fn();
  const addNotification = jest.fn();
  const setLoading = jest.fn();
  const onSubmit = jest.fn();
  const defaultProps = {
    addNotification,
    setLoading,
    isEU: false,
    setIsEU: setValue,
    isUK: false,
    setIsUK: setValue,
    subscriptionType: '',
    setSubscriptionType: setValue,
    userSeats: '',
    setUserSeats: setValue,
    consultantHours: '',
    setConsultantHours: setValue,
    renewalType: '',
    setRenewalType: setValue,
    startDate: '',
    setStartDate: setValue,
    endDate: '',
    setEndDate: setValue,
    endDateType: '',
    setEndDateType: setValue,
    errors: {},
    setErrors: setErrors,
    onSubmit,
    onBack: jest.fn,
  };

  beforeEach(() => {
    wrapper = shallow(<Subscription {...defaultProps} />);
  });

  describe('when clicking on "Save and Continue"', () => {
    let button;

    beforeEach(() => {
      wrapper = shallow(
        <Subscription
          {...defaultProps}
          isEU={true}
          subscriptionType="example"
          renewalType="endDate"
          endDateType="custom"
          startDate="2022-01-01"
          endDate="2024-01-01"
          userSeats="5"
          consultantHours="10"
        />,
      );
      button = wrapper.find('[data-test="continue-button"]');
    });

    it('and updating a client account is successful', async () => {
      await button.simulate('click');

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(setLoading).toHaveBeenCalledTimes(2);
    });

    it('and updating a client account is not successful', async () => {
      await button.simulate('click');

      expect(onSubmit).toHaveBeenCalledTimes(0);
      expect(setLoading).toHaveBeenCalledTimes(2);
      expect(addNotification).toHaveBeenCalledWith({
        text: expect.any(String),
        type: 'warn',
        title: 'Error',
      });
    });
  });

  it('prevents submission if form empty', () => {
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails empty subscription type', () => {
    const input = wrapper.find('[id="subscription-type"]');
    input.simulate('blur');
    expect(setErrors).toHaveBeenCalledWith({ subscriptionType: 'You must choose one' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('sets user seats error', () => {
    const input = wrapper.find('[id="user-seats"]');
    input.props().onBlur('error');
    expect(setErrors).toHaveBeenCalledWith({ userSeats: 'error' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('sets consultant hours error', () => {
    const input = wrapper.find('[id="consultant-hours"]');
    input.props().onBlur('error');
    expect(setErrors).toHaveBeenCalledWith({ consultantHours: 'error' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails empty end date type', () => {
    wrapper = shallow(<Subscription {...defaultProps} renewalType="endDate" />);
    const input = wrapper.find('[id="end-date-type"]');
    input.simulate('blur');
    expect(setErrors).toHaveBeenCalledWith({ endDateType: 'You must choose an end date' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails empty end date', () => {
    wrapper = shallow(
      <Subscription {...defaultProps} renewalType="endDate" endDateType="custom" />,
    );
    const input = wrapper.find('[id="end-date"]');
    input.simulate('blur');
    expect(setErrors).toHaveBeenCalledWith({ endDate: 'You must choose an end date' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('clears subscription type error', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        subscriptionType="option1"
        errors={{ subscriptionType: 'error' }}
      />,
    );
    const input = wrapper.find('[id="subscription-type"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({});
  });

  it('clears user seats error', () => {
    wrapper = shallow(
      <Subscription {...defaultProps} userSeats="5" errors={{ userSeats: 'error' }} />,
    );
    const input = wrapper.find('[id="user-seats"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({});
  });

  it('clears consultant hours error', () => {
    wrapper = shallow(
      <Subscription {...defaultProps} consultantHours="10" errors={{ consultantHours: 'error' }} />,
    );
    const input = wrapper.find('[id="consultant-hours"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({});
  });

  it('clears end date type error', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        renewalType="endDate"
        endDateType="option1"
        errors={{ endDateType: 'error' }}
      />,
    );
    const input = wrapper.find('[id="end-date-type"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({});
  });

  it('clears end date error', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        renewalType="endDate"
        endDateType="custom"
        endDate="2022-01-02"
        errors={{ endDate: 'error' }}
      />,
    );
    const input = wrapper.find('[id="end-date"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({});
  });

  it('adds a location', () => {
    const location = wrapper.find('[id="location-eu"]');
    location.props().onChange();
    expect(setValue).toHaveBeenCalledWith(true);
  });

  it('adds additional location', () => {
    wrapper = shallow(<Subscription {...defaultProps} isEU={true} />);
    const location = wrapper.find('[id="location-uk"]');
    location.props().onChange();
    expect(setValue).toHaveBeenCalledWith(true);
  });

  it('unsets a location', () => {
    wrapper = shallow(<Subscription {...defaultProps} isEU={true} />);
    const location = wrapper.find('[id="location-eu"]');
    location.props().onChange();
    expect(setValue).toHaveBeenCalledWith(false);
  });

  it('sets end date for auto end 1 year', () => {
    wrapper = mount(
      <Subscription {...defaultProps} startDate={'2022-01-01'} renewalType={'endDate'} />,
    );
    wrapper.setProps({ endDateType: '1year' });
    expect(setValue).toHaveBeenCalledWith(format(new Date('2023-01-01'), 'yyyy-MM-dd'));
  });

  it('sets end date for auto end 2 year', () => {
    wrapper = mount(
      <Subscription {...defaultProps} startDate={'2022-01-01'} renewalType={'endDate'} />,
    );
    wrapper.setProps({ endDateType: '2year' });
    expect(setValue).toHaveBeenCalledWith(format(new Date('2024-01-01'), 'yyyy-MM-dd'));
  });

  it('sets end date for auto end 3 year', () => {
    wrapper = mount(
      <Subscription {...defaultProps} startDate={'2022-01-01'} renewalType={'endDate'} />,
    );
    wrapper.setProps({ endDateType: '3year' });
    expect(setValue).toHaveBeenCalledWith(format(new Date('2025-01-01'), 'yyyy-MM-dd'));
  });

  it('sets end date for auto end 2 week trial', () => {
    wrapper = mount(
      <Subscription {...defaultProps} startDate={'2022-01-01'} renewalType={'endDate'} />,
    );
    wrapper.setProps({ endDateType: '2weektrial' });
    expect(setValue).toHaveBeenCalledWith(format(new Date('2022-01-15'), 'yyyy-MM-dd'));
  });

  it('sets end date for custom end date', () => {
    wrapper = mount(
      <Subscription
        {...defaultProps}
        startDate={'2022-01-01'}
        endDate={'2024-01-01'}
        renewalType={'endDate'}
      />,
    );
    wrapper.setProps({ endDateType: 'custom' });
    expect(setValue).toHaveBeenCalledWith('2024-01-01');
  });

  it('renders without error and allows submission for annual renewal', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        isEU={true}
        subscriptionType="example"
        renewalType="annual"
        startDate="2022-01-01"
        userSeats="5"
        consultantHours="10"
      />,
    );
    const component = wrapper.find('[data-test="subscription"]');
    expect(component.length).toEqual(1);
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(false);
  });

  it('renders without error and allows submission for auto end date', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        isEU={true}
        subscriptionType="example"
        renewalType="endDate"
        endDateType="2year"
        startDate="2022-01-01"
        userSeats="5"
        consultantHours="10"
      />,
    );
    const component = wrapper.find('[data-test="subscription"]');
    expect(component.length).toEqual(1);
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(false);
  });

  it('renders without error and allows submission for custom end date', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        isEU={true}
        subscriptionType="example"
        renewalType="endDate"
        endDateType="custom"
        startDate="2022-01-01"
        endDate="2024-01-01"
        userSeats="5"
        consultantHours="10"
      />,
    );
    const component = wrapper.find('[data-test="subscription"]');
    expect(component.length).toEqual(1);
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
