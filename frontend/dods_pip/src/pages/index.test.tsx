import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import * as Validation from '../utils/validation';
import { Home } from './index.page';

describe('Home', () => {
  let wrapper: ShallowWrapper, formEmail, formPassword, formButton: ShallowWrapper;
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
    { ...defaultState, failureCount: 2 }, // shows failure count box
    defaultState, // renders loader
    defaultState, // returns empty form errors
    { ...defaultState, password: 'test' }, // returns missing email error
    { ...defaultState, emailAddress: 'invalid' }, // returns invalid email error
    { ...defaultState, emailAddress: 'test@test.com' }, // returns missing password error
    { ...defaultState, emailAddress: 'test@test.com', password: 'test' }, // clears errors on successful form completion
  ];

  let count = 0;

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
    formButton = wrapper.find('[data-test="form-button"]');
    expect(formEmail.length).toEqual(1);
    expect(formPassword.length).toEqual(1);
    expect(formButton.length).toEqual(1);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="page-home"]');
    expect(component.length).toEqual(1);
  });

  it('shows failure count box', () => {
    const component = wrapper.find('[data-test="failure-count"]');
    expect(component.length).toEqual(1);
  });

  describe('onLogin()', () => {
    it('renders loader', () => {
      formButton.simulate('click');
      expect(setLoadingSpy).toHaveBeenCalledWith(true);
      expect(setLoadingSpy).toHaveBeenCalledWith(false);
      expect(setLoadingSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('validateForm()', () => {
    it('returns empty form errors', async () => {
      formButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateEmailSpy).toHaveBeenCalledTimes(0);
      expect(setState).toHaveBeenCalledWith({
        email: 'Email address is required',
        password: 'Password is required',
      });
    });

    it('returns missing email error', () => {
      formButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateEmailSpy).toHaveBeenCalledTimes(0);
      expect(setState).toHaveBeenCalledWith({
        email: 'Email address is required',
      });
    });

    it('returns invalid email error', () => {
      formButton.simulate('click');
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
      formButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({
        password: 'Password is required',
      });
    });

    it('clears errors on successful form completion', () => {
      formButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(2);
      expect(validateRequiredSpy).toHaveBeenCalledWith('test');
      expect(validateRequiredSpy).toHaveBeenCalledWith('test@test.com');
      expect(validateEmailSpy).toHaveBeenCalledTimes(1);
      expect(validateEmailSpy).toHaveBeenCalledWith('test@test.com');
      expect(setState).toHaveBeenCalledWith({});
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
