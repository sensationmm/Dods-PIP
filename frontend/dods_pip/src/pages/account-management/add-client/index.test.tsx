import { shallow } from 'enzyme';
import React from 'react';
import { AddClient } from './index.page';

global.scrollTo = jest.fn();
const mockRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: (val) => mockRouterPush(val) }),
}));

describe('Account Management: Clients', () => {
  let wrapper, step1, step2, step3, step4;

  const setLoadingSpy = jest.fn();
  const setStateSpy = jest.fn();
  const setActiveStepSpy = jest.fn();
  const setErrorSpy = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    activeStep: 1,
    accountName: '',
    accountNotes: '',
    contactName: '',
    contactEmail: '',
    contactTelephone: '',
    errorsStep1: {},
  };

  const states = [
    defaultState, // renders without error and shows step 1
    { ...defaultState, activeStep: 2 }, // shows step 2
    { ...defaultState, activeStep: 3 }, // shows step 3
    defaultState, // exits create account flow on clicking back
    {
      ...defaultState,
      accountName: 'Somo1',
      contactEmail: 'asd@asd.asd',
      contactTelephone: '1234567',
    }, // submit step1 succeeds
    { ...defaultState, activeStep: 2 }, // proceeds from step 2
    { ...defaultState, activeStep: 3 }, // proceeds from step 3
    { ...defaultState, activeStep: 2 }, // navigates back from step 2
    { ...defaultState, activeStep: 3 }, // navigates back from step 3
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].activeStep, setActiveStepSpy])
      .mockImplementationOnce(() => [states[count].accountName, setStateSpy])
      .mockImplementationOnce(() => [states[count].accountNotes, setStateSpy])
      .mockImplementationOnce(() => [states[count].contactName, setStateSpy])
      .mockImplementationOnce(() => [states[count].contactEmail, setStateSpy])
      .mockImplementationOnce(() => [states[count].contactTelephone, setStateSpy])
      .mockImplementationOnce(() => [states[count].errorsStep1, setErrorSpy]);

    wrapper = shallow(<AddClient isLoading={false} setLoading={setLoadingSpy} />);
    step1 = wrapper.find('[data-test="step-1"]');
    step2 = wrapper.find('[data-test="step-2"]');
    step3 = wrapper.find('[data-test="step-3"]');
    step4 = wrapper.find('[data-test="step-4"]');
  });

  it('renders without error and shows step 1', () => {
    const component = wrapper.find('[data-test="page-account-management-add-client"]');
    expect(component.length).toEqual(1);
    expect(step1.length).toEqual(1);
    expect(step2.length).toEqual(0);
    expect(step3.length).toEqual(0);
    expect(step4.length).toEqual(0);
  });

  it('shows step 2', () => {
    expect(step1.length).toEqual(0);
    expect(step2.length).toEqual(1);
    expect(step3.length).toEqual(0);
    expect(step4.length).toEqual(0);
  });

  it('shows step 3', () => {
    expect(step1.length).toEqual(0);
    expect(step2.length).toEqual(0);
    expect(step3.length).toEqual(1);
    expect(step4.length).toEqual(0);
  });

  it('exits create account flow on clicking back', () => {
    step1.props().onBack();
    expect(mockRouterPush).toHaveBeenCalledWith('/account-management/accounts');
  });

  it('submit step1 succeeds', () => {
    step1.props().onSubmit();
    expect(setActiveStepSpy).toHaveBeenCalledWith(2);
  });

  it('proceeds from step 2', () => {
    step2.props().onSubmit();
    expect(setActiveStepSpy).toHaveBeenCalledWith(3);
  });

  it('proceeds from step 3', () => {
    step3.props().onSubmit();
    expect(setActiveStepSpy).toHaveBeenCalledWith(4);
  });

  it('navigates back from step 2', () => {
    step2.props().onBack();
    expect(setActiveStepSpy).toHaveBeenCalledWith(1);
  });

  it('navigates back from step 3', () => {
    step3.props().onBack();
    expect(setActiveStepSpy).toHaveBeenCalledWith(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
