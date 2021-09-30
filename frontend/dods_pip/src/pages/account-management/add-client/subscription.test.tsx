import { format } from 'date-fns';
import { shallow, mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

import Subscription from './subscription';

describe('Subscription', () => {
  let wrapper, setActiveStep;

  const setErrors = jest.fn();
  const setValue = jest.fn();
  const defaultProps = {
    location: [],
    setLocation: setValue,
    contentType: [],
    setContentType: setValue,
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
    onSubmit: jest.fn,
    onBack: jest.fn,
  };

  beforeEach(() => {
    setActiveStep = jest.fn();
    wrapper = shallow(<Subscription {...defaultProps} />);
  });

  it('prevents submission if form empty', () => {
    wrapper = shallow(<Subscription {...defaultProps} />);
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails empty content type', () => {
    const input = wrapper.find('[id="content-type"]');
    input.simulate('blur');
    expect(setErrors).toHaveBeenCalledWith({ contentType: 'You must choose at least one' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('sets passed user seats error', () => {
    const input = wrapper.find('[id="user-seats"]');
    input.props().onBlur('error');
    expect(setErrors).toHaveBeenCalledWith({ userSeats: 'error' });
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

  it('clears content type error', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        contentType={['option1']}
        errors={{ contentType: 'error' }}
      />,
    );
    const input = wrapper.find('[id="content-type"]');
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
    expect(setValue).toHaveBeenCalledWith(['eu']);
  });

  it('adds additional location', () => {
    wrapper = shallow(<Subscription {...defaultProps} location={['eu']} />);
    const location = wrapper.find('[id="location-uk"]');
    location.props().onChange();
    expect(setValue).toHaveBeenCalledWith(['eu', 'uk']);
  });

  it('unsets a location', () => {
    wrapper = shallow(<Subscription {...defaultProps} location={['eu', 'uk']} />);
    const location = wrapper.find('[id="location-eu"]');
    location.props().onChange();
    expect(setValue).toHaveBeenCalledWith(['uk']);
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
    expect(setValue).toHaveBeenCalledWith('');
  });

  it('renders without error and allows submission for annual renewal', () => {
    wrapper = shallow(
      <Subscription
        {...defaultProps}
        location={['option1']}
        contentType={['example']}
        renewalType="annual"
        startDate="2022-01-01"
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
        location={['option1']}
        contentType={['example']}
        renewalType="endDate"
        endDateType="2year"
        startDate="2022-01-01"
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
        location={['option1']}
        contentType={['example']}
        renewalType="endDate"
        endDateType="custom"
        startDate="2022-01-01"
        endDate="2024-01-01"
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
