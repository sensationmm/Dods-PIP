import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import * as Validation from '../utils/validation';
import { ResetPassword } from './reset-password.page';

jest.mock('../lib/fetchJson', () => {
  return jest
    .fn()
    .mockImplementationOnce(() => Promise.reject({ data: { name: 'OtherException' } }))
    .mockImplementation(() => Promise.resolve());
});

describe('ResetPassword', () => {
  let wrapper: ShallowWrapper, formButton: ShallowWrapper;
  const validateRequiredSpy = jest.spyOn(Validation, 'validateRequired');
  const validateEmailSpy = jest.spyOn(Validation, 'validateEmail');
  const setLoadingSpy = jest.fn();
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    emailAddress: undefined,
    errors: {},
    requested: false,
  };

  const states = [
    defaultState, // renders without error
    defaultState, // renders reset request
    { ...defaultState, requested: true }, // renders reset request confirmation
    defaultState, // returns missing email error
    { ...defaultState, emailAddress: 'invalid' }, // returns invalid email error
    { ...defaultState, emailAddress: 'test@test.com' }, // catches api failure
    { ...defaultState, emailAddress: 'test@test.com' }, // clears errors on successful form completion
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].emailAddress, setState])
      .mockImplementationOnce(() => [states[count].errors, setState])
      .mockImplementationOnce(() => [states[count].requested, setState]);
    wrapper = shallow(<ResetPassword isLoading={false} setLoading={setLoadingSpy} />);
    formButton = wrapper.find('[data-test="form-button"]');
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="page-reset-password"]');
    expect(component.length).toEqual(1);
    expect(formButton.length).toEqual(1);
  });

  it('renders reset request', () => {
    const request = wrapper.find('[data-test="reset-request"]');
    const confirmation = wrapper.find('[data-test="reset-confirmation"]');
    expect(request.length).toEqual(1);
    expect(confirmation.length).toEqual(0);
  });

  it('renders reset request confirmation', () => {
    const request = wrapper.find('[data-test="reset-request"]');
    const confirmation = wrapper.find('[data-test="reset-confirmation"]');
    expect(request.length).toEqual(0);
    expect(confirmation.length).toEqual(1);
  });

  describe('validateForm()', () => {
    it('returns missing email error', () => {
      formButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledTimes(0);
      expect(setState).toHaveBeenCalledWith({
        email: 'Email address is required',
      });
    });

    it('returns invalid email error', () => {
      formButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(1);
      expect(validateRequiredSpy).toHaveBeenCalledWith('invalid');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('invalid');
      expect(setState).toHaveBeenCalledWith({
        email: 'Invalid format',
      });
    });

    it('catches api failure', async () => {
      await formButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(setState).toHaveBeenCalledWith({ form: 'FAIL' });
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('clears errors on successful form completion', async () => {
      await formButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(validateRequiredSpy).toHaveBeenCalledTimes(1);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({});
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
