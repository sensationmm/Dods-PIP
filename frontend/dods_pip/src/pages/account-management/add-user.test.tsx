import { shallow } from 'enzyme';
import React from 'react';

import { RoleType } from '../account-management/add-client/type';
import AddUserForm from './add-user-form';

describe('AddUserForm', () => {
  let wrapper;

  const mockSetErrors = jest.fn();
  const mockChange = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultState = {
    userType: RoleType.Admin,
    firstName: '',
    lastName: '',
    account: '',
    jobTitle: '',
    emailAddress: '',
    emailAddress2: '',
    telephoneNumber: '',
    telephoneNumber2: '',
    errors: {},
    setErrors: mockSetErrors,
  };

  const states = [
    defaultState, // renders without error
    defaultState, // fails empty first name
    defaultState, // fails empty last name
    defaultState, // fails empty account
    defaultState, // fails empty job title
    defaultState, // fails empty email
    defaultState, // fails empty telephone
    { ...defaultState, emailAddress: 'sad' }, // fails invalid email
    { ...defaultState, emailAddress2: 'sad' }, // fails invalid email 2
    { ...defaultState, telephoneNumber: 'asd' }, // fails invalid telephone number
    { ...defaultState, telephoneNumber2: 'asd' }, // fails invalid telephone number 2
    { ...defaultState, firstName: 'asd', errors: { firstName: 'error' } }, // clears first name error
    { ...defaultState, lastName: 'asd', errors: { lastName: 'error' } }, // clears last name error
    { ...defaultState, account: 'asd', errors: { account: 'error' } }, // clears account error
    { ...defaultState, jobTitle: 'asd', errors: { jobTitle: 'error' } }, // clears job title error
    { ...defaultState, emailAddress: 'asd@asd.asd', errors: { emailAddress: 'error' } }, // clears email error
    { ...defaultState, emailAddress2: 'asd@asd.asd', errors: { emailAddress2: 'error' } }, // clears email 2 error
    { ...defaultState, telephoneNumber: '123456789', errors: { telephoneNumber: 'error' } }, // clears telephone error
    { ...defaultState, telephoneNumber2: '123456789', errors: { telephoneNumber2: 'error' } }, // clears telephone 2 error
  ];

  let count = 0;

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].userType, mockChange])
      .mockImplementationOnce(() => [states[count].firstName, mockChange])
      .mockImplementationOnce(() => [states[count].lastName, mockChange])
      .mockImplementationOnce(() => [states[count].account, mockChange])
      .mockImplementationOnce(() => [states[count].jobTitle, mockChange])
      .mockImplementationOnce(() => [states[count].emailAddress, mockChange])
      .mockImplementationOnce(() => [states[count].emailAddress2, mockChange])
      .mockImplementationOnce(() => [states[count].telephoneNumber, mockChange])
      .mockImplementationOnce(() => [states[count].telephoneNumber2, mockChange])
      .mockImplementationOnce(() => [states[count].errors, mockSetErrors]);

    wrapper = shallow(<AddUserForm {...states[count]} isClientUser />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="add-user-form"]');
    expect(component.length).toEqual(1);
  });

  it('fails empty first name', () => {
    const input = wrapper.find('[id="firstName"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ firstName: 'This field is required' });
  });

  it('fails empty last name', () => {
    const input = wrapper.find('[id="lastName"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ lastName: 'This field is required' });
  });

  it('fails empty account', () => {
    const input = wrapper.find('[id="account"]');
    input.simulate('focus');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ account: 'This field is required' });
  });

  it('fails empty job title', () => {
    const input = wrapper.find('[id="jobTitle"]');
    input.simulate('focus');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ jobTitle: 'This field is required' });
  });

  it('fails empty email', () => {
    const input = wrapper.find('[id="emailAddress"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ emailAddress: 'This field is required' });
  });

  it('fails empty telephone', () => {
    const input = wrapper.find('[id="telephoneNumber"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ telephoneNumber: 'This field is required' });
  });

  it('fails invalid email', () => {
    const input = wrapper.find('[id="emailAddress"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ emailAddress: 'Invalid format' });
  });

  it('fails invalid email2', () => {
    const input = wrapper.find('[id="emailAddress2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ emailAddress2: 'Invalid format' });
  });

  it('fails invalid telephone', () => {
    const input = wrapper.find('[id="telephoneNumber"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ telephoneNumber: 'Invalid telephone' });
  });

  it('fails invalid telephone 2', () => {
    const input = wrapper.find('[id="telephoneNumber2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ telephoneNumber2: 'Invalid telephone' });
  });

  it('clears first name error', () => {
    const input = wrapper.find('[id="firstName"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears last name error', () => {
    const input = wrapper.find('[id="lastName"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears account error', () => {
    const input = wrapper.find('[id="account"]');
    input.simulate('focus');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears job title error', () => {
    const input = wrapper.find('[id="jobTitle"]');
    input.simulate('focus');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears email error', () => {
    const input = wrapper.find('[id="emailAddress"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears email 2 error', () => {
    const input = wrapper.find('[id="emailAddress2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears telephone error', () => {
    const input = wrapper.find('[id="telephoneNumber"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears telephone 2 error', () => {
    const input = wrapper.find('[id="telephoneNumber2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  afterEach(() => {
    count++;
    jest.clearAllMocks();
  });
});
