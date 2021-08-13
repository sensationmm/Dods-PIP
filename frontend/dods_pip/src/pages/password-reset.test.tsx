import React from 'react';
import { shallow } from 'enzyme';

import { useRouter } from 'next/router';
import { PasswordReset } from './password-reset.page';
import * as Validation from '../utils/validation';

jest.mock('next/router', () => ({ useRouter: jest.fn().mockReturnValue({ push: jest.fn() }) }));

describe('PasswordReset', () => {
  let wrapper: any, formButton: any;
  const validateRequiredSpy = jest.spyOn(Validation, 'validateRequired');
  const validatePasswordSpy = jest.spyOn(Validation, 'validatePassword');
  const validateMatchingSpy = jest.spyOn(Validation, 'validateMatching');
  const setLoadingSpy = jest.fn();
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    password: undefined,
    passwordConfirm: undefined,
    errors: {},
    confirmed: false,
    passwordStrength: {},
    isRepeatPassword: false,
  };

  const states = [
    defaultState, // renders without error
    defaultState, // renders password reset
    { ...defaultState, confirmed: true }, // renders password reset confirmation
    defaultState, // returns empty form errors
    { ...defaultState, password: 'invalid' }, // returns invalid password error
    { ...defaultState, password: 'Valid123!' }, // returns missing passwordConfirm error
    { ...defaultState, password: 'Valid123!', passwordConfirm: 'invalid' }, // eturns unmatching passwordConfirm error
    { ...defaultState, password: 'Valid123!', passwordConfirm: 'Valid123!' }, // clears errors on successful form completion
    defaultState, // executes password onChange funcs
    { ...defaultState, confirmed: true }, // navigates back to login at end of flow
    { ...defaultState, isRepeatPassword: true }, // shows repeat password warning
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].password, setState])
      .mockImplementationOnce(() => [states[count].passwordConfirm, setState])
      .mockImplementationOnce(() => [states[count].errors, setState])
      .mockImplementationOnce(() => [states[count].confirmed, setState])
      .mockImplementationOnce(() => [states[count].passwordStrength, setState])
      .mockImplementationOnce(() => [states[count].isRepeatPassword, setState]);
    wrapper = shallow(<PasswordReset isLoading={false} setLoading={setLoadingSpy} />);
    formButton = wrapper.find('[data-test="form-button"]');
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="page-password-reset"]');
    expect(component.length).toEqual(1);
    expect(formButton.length).toEqual(1);
  });

  it('renders password reset', () => {
    const request = wrapper.find('[data-test="reset-request"]');
    const confirmation = wrapper.find('[data-test="reset-confirmation"]');
    expect(request.length).toEqual(1);
    expect(confirmation.length).toEqual(0);
  });

  it('renders password reset confirmation', () => {
    const request = wrapper.find('[data-test="reset-request"]');
    const confirmation = wrapper.find('[data-test="reset-confirmation"]');
    expect(request.length).toEqual(0);
    expect(confirmation.length).toEqual(1);
  });

  it('returns empty form errors', () => {
    formButton.simulate('click');
    expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
    expect(validatePasswordSpy).toHaveBeenCalledTimes(0);
    expect(validateMatchingSpy).toHaveBeenCalledTimes(0);
    expect(setState).toHaveBeenCalledWith({
      password: 'Password is required',
      passwordConfirm: 'Confirm password is required',
    });
  });

  it('returns invalid password error', () => {
    formButton.simulate('click');
    expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
    expect(validatePasswordSpy).toHaveBeenCalledTimes(1);
    expect(validatePasswordSpy).toHaveBeenCalledWith('invalid');
    expect(validateMatchingSpy).toHaveBeenCalledTimes(0);
    expect(setState).toHaveBeenCalledWith({
      password: 'Password must meet all criteria',
      passwordConfirm: 'Confirm password is required',
    });
  });

  it('returns missing passwordConfirm error', () => {
    formButton.simulate('click');
    expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
    expect(validatePasswordSpy).toHaveBeenCalledTimes(1);
    expect(validatePasswordSpy).toHaveBeenCalledWith('Valid123!');
    expect(validateMatchingSpy).toHaveBeenCalledTimes(0);
    expect(setState).toHaveBeenCalledWith({
      passwordConfirm: 'Confirm password is required',
    });
  });

  it('returns unmatching passwordConfirm error', () => {
    formButton.simulate('click');
    expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
    expect(validatePasswordSpy).toHaveBeenCalledTimes(1);
    expect(validatePasswordSpy).toHaveBeenCalledWith('Valid123!');
    expect(validateMatchingSpy).toHaveBeenCalledTimes(1);
    expect(validateMatchingSpy).toHaveBeenCalledWith('invalid', 'Valid123!');
    expect(setState).toHaveBeenCalledWith({
      passwordConfirm: 'Passwords must match',
    });
  });

  it('clears errors on successful form completion', () => {
    formButton.simulate('click');
    expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
    expect(validatePasswordSpy).toHaveBeenCalledTimes(1);
    expect(validatePasswordSpy).toHaveBeenCalledWith('Valid123!');
    expect(validateMatchingSpy).toHaveBeenCalledTimes(1);
    expect(validateMatchingSpy).toHaveBeenCalledWith('Valid123!', 'Valid123!');
    expect(setState).toHaveBeenCalledWith({});
  });

  it('executes password onChange funcs', () => {
    const passwordInput = wrapper.find('[data-test="reset-password"]');
    passwordInput.props().onChange('Test123!');
    expect(setState).toHaveBeenCalledWith('Test123!');
    expect(validatePasswordSpy).toHaveBeenCalledWith('Test123!');
    expect(passwordInput.length).toBe(1);
  });

  it('navigates back to login at end of flow', () => {
    const backToLogin = wrapper.find('[data-test="button-back-to-login"]');
    backToLogin.simulate('click');
    expect(useRouter().push).toHaveBeenCalledWith('/');
  });

  it('shows repeat password warning', () => {
    const warning = wrapper.find('[data-test="repeat-password-warning"]');
    expect(warning.length).toEqual(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
