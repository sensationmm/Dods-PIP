import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import fetchJson from '../lib/fetchJson';
import * as Validation from '../utils/validation';
import { Home } from './index.page';

jest.mock('../lib/fetchJson', () => {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => {},
    }),
  );
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
    warning3;
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
    { ...defaultState, emailAddress: 'test@test.com', password: 'test' }, // captures login fail
    { ...defaultState, emailAddress: 'test@test.com', password: 'test' }, // clears errors on successful form completion
    { ...defaultState, failureCount: 3 }, // handles account unblocking
  ];

  let count = 0;

  beforeAll(() => {
    global.fetch = () => {
      return Promise.resolve({
        json: () => Promise.resolve([]),
      });
    };
  });

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].emailAddress, setState])
      .mockImplementationOnce(() => [states[count].password, setState])
      .mockImplementationOnce(() => [states[count].remember, setState])
      .mockImplementationOnce(() => [states[count].errors, setState])
      .mockImplementationOnce(() => [states[count].failureCount, setState]);
    wrapper = shallow(<Home isLoading={false} setLoading={setLoadingSpy} />);
    formEmail = wrapper.find('[data-test="login-email"]');
    formPassword = wrapper.find('[data-test="login-password"]');
    loginButton = wrapper.find('[data-test="login-button"]');
    unblockButton = wrapper.find('[data-test="unblock-button"]');
    warning1 = wrapper.find('[data-test="warning-1"]');
    warning2 = wrapper.find('[data-test="warning-2"]');
    warning3 = wrapper.find('[data-test="warning-3"]');
    expect(formEmail.length).toEqual(1);
    expect(formPassword.length).toEqual(1);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="page-home"]');
    expect(component.length).toEqual(1);
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

    it('clears catches login fail', () => {
      loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({});

      // return fetchJson('example')
      //   .then()
      //   .catch((data) => {
      //     expect(mockMutateUserSpy).toHaveBeenCalledTimes(1);
      //     expect(setState).toHaveBeenCalledWith('fail');
      //   });
    });

    it('clears errors on successful form completion', () => {
      loginButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({});
      expect(setLoadingSpy).toHaveBeenCalledWith(true);

      // return fetchJson('example')
      //   .then((data) => {
      //     expect(mockMutateUserSpy).toHaveBeenCalledTimes(1);
      //     expect(setState).toHaveBeenCalledWith(false);
      //   })
      //   .catch();
    });

    // it('handles account unblocking', () => {
    //   unblockButton.simulate('click');
    //   expect(setLoadingSpy).toHaveBeenCalledWith(true);
    //   expect(setLoadingSpy).toHaveBeenCalledWith(false);
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
