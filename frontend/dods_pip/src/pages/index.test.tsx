import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import * as Validation from '../utils/validation';
import { Home } from './index.page';

const mockCookieGet = jest.fn();
const mockCookieSet = jest.fn();

jest.mock('cookie-cutter', () => ({
  get: (name: string) => mockCookieGet(name),
  set: (name: string, value: string) => mockCookieSet(name, value),
}));

jest.mock('../lib/fetchJson', () => {
  return jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.reject({ data: { name: 'NotAuthorizedException', failedLoginAttemptCount: 2 } }),
    )
    .mockImplementationOnce(() =>
      Promise.reject({ data: { name: 'OtherException', failedLoginAttemptCount: 2 } }),
    )
    .mockImplementationOnce(() => Promise.reject({ data: { name: 'FAIL' } }))
    .mockImplementation(() => Promise.resolve());
});

const mockMutateUserSpy = jest.fn();
jest.mock('../lib/useUser', () => {
  return jest.fn().mockImplementation(() => {
    return { user: { isLoggedIn: true }, mutateUser: mockMutateUserSpy };
  });
});

describe('Home', () => {
  let wrapper: ShallowWrapper,
    formEmail,
    formPassword,
    loginButton: ShallowWrapper,
    unblockButton,
    warning1,
    warning2,
    warning3,
    unblockConfirmation;
  const validateRequiredSpy = jest.spyOn(Validation, 'validateRequired');
  const validateEmailSpy = jest.spyOn(Validation, 'validateEmail');
  const setLoadingSpy = jest.fn();
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    emailAddress: undefined,
    password: undefined,
    remember: false,
    errors: {},
    failureCount: 0,
    unblockingRequested: false,
  };

  const states = [
    defaultState, // renders without error
    { ...defaultState, failureCount: 1 }, // shows 1st failure
    { ...defaultState, failureCount: 2 }, // shows 2nd failure
    { ...defaultState, failureCount: 3 }, // shows 3rd failure and blocked account
    defaultState, // renders loader
    defaultState, // returns empty form errors
    { ...defaultState, password: 'test' }, // returns missing email error
    { ...defaultState, emailAddress: 'invalid' }, // returns invalid email error
    { ...defaultState, emailAddress: 'test@test.com' }, // returns missing password error
    { ...defaultState, emailAddress: 'test@test.com', password: 'test' }, // captures onLogin fail
    { ...defaultState, emailAddress: 'test@test.com', password: 'test' }, // captures onLogin generic fail
    { ...defaultState, failureCount: 3, emailAddress: 'test@test.com', password: 'test' }, // captures onUnblock fail
    { ...defaultState, remember: false, emailAddress: 'test@test.com', password: 'test' }, // login success without remember
    { ...defaultState, remember: true, emailAddress: 'test@test.com', password: 'test' }, // login success with remember
    { ...defaultState, failureCount: 3 }, // handles account unblocking
    { ...defaultState, unblockingRequested: true }, //renders unblocking confirmation
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].emailAddress, setState])
      .mockImplementationOnce(() => [states[count].password, setState])
      .mockImplementationOnce(() => [states[count].remember, setState])
      .mockImplementationOnce(() => [states[count].errors, setState])
      .mockImplementationOnce(() => [states[count].failureCount, setState])
      .mockImplementationOnce(() => [states[count].unblockingRequested, setState]);
    wrapper = shallow(<Home isLoading={false} setLoading={setLoadingSpy} />);
    formEmail = wrapper.find('[data-test="login-email"]');
    formPassword = wrapper.find('[data-test="login-password"]');
    loginButton = wrapper.find('[data-test="login-button"]');
    unblockButton = wrapper.find('[data-test="unblock-button"]');
    warning1 = wrapper.find('[data-test="warning-1"]');
    warning2 = wrapper.find('[data-test="warning-2"]');
    warning3 = wrapper.find('[data-test="warning-3"]');
    unblockConfirmation = wrapper.find('[data-test="unblock-confirmation"]');
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="page-home"]');
    expect(component.length).toEqual(1);
    expect(formEmail.length).toEqual(1);
    expect(formPassword.length).toEqual(1);
    expect(loginButton.length).toEqual(1);
    expect(unblockButton.length).toEqual(0);
  });

  describe('failure count box', () => {
    it('shows 1st failure', () => {
      const component = wrapper.find('[data-test="failure-count"]');
      expect(component.length).toEqual(1);
      expect(warning1.length).toEqual(1);
      expect(warning2.length).toEqual(0);
      expect(warning3.length).toEqual(0);
    });

    it('shows 2nd failure', () => {
      const component = wrapper.find('[data-test="failure-count"]');
      expect(component.length).toEqual(1);
      expect(warning1.length).toEqual(1);
      expect(warning2.length).toEqual(1);
      expect(warning3.length).toEqual(0);
    });

    it('shows 3rd failure and blocked account', () => {
      const component = wrapper.find('[data-test="failure-count"]');
      expect(component.length).toEqual(1);
      expect(warning1.length).toEqual(0);
      expect(warning2.length).toEqual(0);
      expect(warning3.length).toEqual(1);
      expect(loginButton.length).toEqual(0);
      expect(unblockButton.length).toEqual(1);
    });
  });

  describe('onLogin()', () => {
    it('renders loader', () => {
      loginButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
      expect(setLoadingSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateForm()', () => {
    it('returns empty form errors', async () => {
      loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateEmailSpy).toHaveBeenCalledTimes(0);
      expect(setState).toHaveBeenCalledWith({
        email: 'Email address is required',
        password: 'Password is required',
      });
    });

    it('returns missing email error', () => {
      loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateEmailSpy).toHaveBeenCalledTimes(0);
      expect(setState).toHaveBeenCalledWith({
        email: 'Email address is required',
      });
    });

    it('returns invalid email error', () => {
      loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('invalid');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('invalid');
      expect(setState).toHaveBeenCalledWith({
        email: 'Invalid format',
        password: 'Password is required',
      });
    });

    it('returns missing password error', () => {
      loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({
        password: 'Password is required',
      });
    });

    it('catches onLogin fail', async () => {
      await loginButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({});
      expect(setState).toHaveBeenCalledWith(2);
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
      expect(mockCookieSet).toHaveBeenCalledTimes(0);
    });

    it('catches onLogin generic fail', async () => {
      await loginButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(setState).toHaveBeenCalledWith({ form: 'FAIL' });
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('catches onUnblock fail', async () => {
      await unblockButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
      expect(setState).toHaveBeenCalledWith({ form: 'FAIL' });
    });

    it('login success without remember', async () => {
      expect(mockCookieGet).toHaveBeenCalledWith('dods-login-username');
      expect(mockCookieGet).toHaveBeenCalledWith('dods-login-password');
      await loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({});
      expect(setLoadingSpy).toHaveBeenCalledWith(true);

      expect(setLoadingSpy).toHaveBeenCalledWith(false);
      expect(mockMutateUserSpy).toHaveBeenCalledTimes(1);
      expect(mockCookieSet).toHaveBeenCalledTimes(0);
    });

    it('login success with remember', async () => {
      await loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({});
      expect(setLoadingSpy).toHaveBeenCalledWith(true);

      expect(setLoadingSpy).toHaveBeenCalledWith(false);
      expect(mockMutateUserSpy).toHaveBeenCalledTimes(1);
      expect(mockCookieSet).toHaveBeenCalledWith('dods-login-username', 'test@test.com');
      expect(mockCookieSet).toHaveBeenCalledWith('dods-login-password', 'test');
    });

    it('handles account unblocking', async () => {
      await unblockButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);

      expect(setState).toHaveBeenCalledWith(0);
      expect(setState).toHaveBeenCalledWith(true);
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
    });

    it('renders unblocking confirmation', async () => {
      expect(unblockConfirmation.length).toEqual(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
