import React from 'react';
import { shallow } from 'enzyme';
import { ResetPassword } from './reset-password.page';
import * as Validation from '../utils/validation';

describe('ResetPassword', () => {
  let wrapper: any, formEmail: any, formPassword, formButton: any;
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
    { ...defaultState, emailAddress: 'test@test.com' }, // clears errors on successful form completion
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].emailAddress, setState])
      .mockImplementationOnce(() => [states[count].errors, setState])
      .mockImplementationOnce(() => [states[count].requested, setState]);
    wrapper = shallow(<ResetPassword isLoading={false} setLoading={setLoadingSpy} />);
    formEmail = wrapper.find('[data-test="reset-email"]');
    formButton = wrapper.find('[data-test="form-button"]');
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="page-reset-password"]');
    expect(component.length).toEqual(1);
    expect(formEmail.length).toEqual(1);
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

    it('clears errors on successful form completion', () => {
      formButton.simulate('click');
      expect(validateRequiredSpy).toHaveBeenCalledTimes(1);
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