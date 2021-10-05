import { shallow } from 'enzyme';
import React from 'react';

import Team from './team';

describe('Team', () => {
  let wrapper, setActiveStep;
  let count = 0;
  const mockSetAddUser = jest.fn();
  const mockSetErrors = jest.fn();
  const mockSetClientUsers = jest.fn();
  const mockSetClient = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultProps = {
    teamMembers: [],
    setTeamMembers: jest.fn,
    accountManagers: [],
    setAccountManagers: jest.fn,
    clientUsers: [],
    setClientUsers: mockSetClientUsers,
    clientFirstName: '',
    setClientFirstName: mockSetClient,
    clientLastName: '',
    setClientLastName: mockSetClient,
    clientJobTitle: '',
    setClientJobTitle: mockSetClient,
    clientEmail: '',
    setClientEmail: mockSetClient,
    clientEmail2: '',
    setClientEmail2: mockSetClient,
    clientTelephone: '',
    setClientTelephone: mockSetClient,
    clientTelephone2: '',
    setClientTelephone2: mockSetClient,
    clientAccess: '',
    setClientAccess: mockSetClient,
    errors: {},
    setErrors: mockSetErrors,
    onSubmit: jest.fn,
    onBack: jest.fn,
  };

  const props = [
    defaultProps,
    defaultProps,
    defaultProps,
    defaultProps,
    defaultProps,
    { ...defaultProps, clientEmail: 'test' },
    { ...defaultProps, clientEmail2: 'test' },
    { ...defaultProps, clientTelephone: '123' },
    { ...defaultProps, clientTelephone2: '123' },
    { ...defaultProps, clientFirstName: 'test', errors: { clientFirstName: 'error' } },
    { ...defaultProps, clientLastName: 'test', errors: { clientLastName: 'error' } },
    { ...defaultProps, clientEmail: 'test@test.com', errors: { clientEmail: 'error' } },
    { ...defaultProps, clientEmail2: 'test@test.com', errors: { clientEmail2: 'error' } },
    { ...defaultProps, clientTelephone: '123456789', errors: { clientTelephone: 'error' } },
    { ...defaultProps, clientTelephone2: '123456789', errors: { clientTelephone2: 'error' } },
    {
      ...defaultProps,
      teamMembers: [],
      clientUsers: [],
      clientFirstName: 'Test',
      clientLastName: 'Test',
      clientEmail: 'test@test.com',
      clientAccess: 'user',
    },
    defaultProps,
    { ...defaultProps, clientUsers: ['team member 1', 'team member 1'] },
  ];

  const states = [
    { addUser: false },
    { addUser: false },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: true },
    { addUser: false },
  ];

  beforeEach(() => {
    useStateSpy.mockImplementationOnce(() => [states[count].addUser, mockSetAddUser]);
    setActiveStep = jest.fn();
    wrapper = shallow(<Team {...props[count]} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="team"]');
    expect(component.length).toEqual(1);
  });

  it('opens add client', () => {
    const addUserButton = wrapper.find('[data-test="create-new-user"]');
    addUserButton.simulate('click');
    expect(mockSetAddUser).toHaveBeenCalledWith(true);
  });

  it('fails empty client first name', () => {
    const input = wrapper.find('[id="first-name"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ clientFirstName: 'This field is required' });
  });

  it('fails empty client last name', () => {
    const input = wrapper.find('[id="last-name"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ clientLastName: 'This field is required' });
  });

  it('fails empty client email', () => {
    const input = wrapper.find('[id="email-address"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ clientEmail: 'This field is required' });
  });

  it('fails invalid client email', () => {
    const input = wrapper.find('[id="email-address"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ clientEmail: 'Invalid format' });
  });

  it('fails invalid client email2', () => {
    const input = wrapper.find('[id="email-address2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ clientEmail2: 'Invalid format' });
  });

  it('fails invalid client telephone', () => {
    const input = wrapper.find('[id="telephone"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ clientTelephone: 'Invalid telephone' });
  });

  it('fails invalid client telephone 2', () => {
    const input = wrapper.find('[id="telephone2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({ clientTelephone2: 'Invalid telephone' });
  });

  it('clears first name error', () => {
    const input = wrapper.find('[id="first-name"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears last name error', () => {
    const input = wrapper.find('[id="last-name"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears email error', () => {
    const input = wrapper.find('[id="email-address"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears email 2 error', () => {
    const input = wrapper.find('[id="email-address2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears telephone error', () => {
    const input = wrapper.find('[id="telephone"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('clears telephone 2 error', () => {
    const input = wrapper.find('[id="telephone2"]');
    input.simulate('blur');
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('adds client', () => {
    const submitButton = wrapper.find('[data-test="create-user-button"]');
    submitButton.simulate('click');
    expect(mockSetClientUsers).toHaveBeenCalledWith(['Test Test']);
    expect(mockSetClient).toHaveBeenCalledTimes(8);
    expect(mockSetAddUser).toHaveBeenCalledWith(false);
  });

  it('cancels add client', () => {
    const cancelAddUser = wrapper.find('[data-test="add-user-actions"]');
    cancelAddUser.props().backHandler();
    expect(mockSetClient).toHaveBeenCalledTimes(8);
    expect(mockSetAddUser).toHaveBeenCalledWith(false);
  });

  it('shows added users', () => {
    const addedUsers = wrapper.find('[data-test="added-client-users"]');
    expect(addedUsers.length).toEqual(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
