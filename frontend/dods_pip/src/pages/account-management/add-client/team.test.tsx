import { shallow } from 'enzyme';
import React from 'react';

import Team from './team';

jest.mock('../../../lib/fetchJson', () => {
  return jest.fn().mockReturnValue(
    Promise.resolve({
      success: true,
      data: [
        { id: '12', firstName: 'Jane', lastName: 'Doe', teamMemberType: 3 },
        { id: '13', firstName: 'Test', lastName: 'Test', teamMemberType: 3 },
        { id: '20', firstName: 'John', lastName: 'Doe', teamMemberType: 2 },
      ],
    }),
  );
});

jest.mock('../../../lib/useTeamMembers', () => {
  return jest
    .fn()
    .mockReturnValue({ clients: [{ id: '12', name: 'Jane Doe', teamMemberType: 3 }] });
});

describe('Team', () => {
  let wrapper, setActiveStep;
  let count = 0;
  const mockSetCreateUser = jest.fn();
  const mockSetAddUser = jest.fn();
  const mockSetErrors = jest.fn();
  const mockSetClientUsers = jest.fn();
  const mockSetClient = jest.fn();
  const mockSetLoading = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState');

  const defaultProps = {
    setLoading: mockSetLoading,
    addNotification: jest.fn(),
    editMode: false,
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
    // clientAccess: '',
    // setClientAccess: mockSetClient,
    errors: {},
    setErrors: mockSetErrors,
    userSeats: 4,
    onSubmit: jest.fn,
    onBack: jest.fn,
  };

  const props = [
    defaultProps, // renders without error
    defaultProps, // opens add client
    defaultProps, // fails empty client first name
    defaultProps, // fails empty client last name
    defaultProps, // fails empty client email
    { ...defaultProps, clientEmail: 'test' }, // fails invalid client email
    { ...defaultProps, clientEmail2: 'test' }, // fails empty client email
    { ...defaultProps, clientTelephone: '123' }, // fails invalid client telephone
    { ...defaultProps, clientTelephone2: '123' }, // fails invalid client telephone 2
    { ...defaultProps, clientFirstName: 'test', errors: { clientFirstName: 'error' } }, // clears first name error
    { ...defaultProps, clientLastName: 'test', errors: { clientLastName: 'error' } }, // clears last name error
    { ...defaultProps, clientEmail: 'test@test.com', errors: { clientEmail: 'error' } }, // clears email error
    { ...defaultProps, clientEmail2: 'test@test.com', errors: { clientEmail2: 'error' } }, // clears email 2 error
    { ...defaultProps, clientTelephone: '123456789', errors: { clientTelephone: 'error' } }, // clears telephone error
    { ...defaultProps, clientTelephone2: '123456789', errors: { clientTelephone2: 'error' } }, // clears telephone 2 error
    {
      ...defaultProps,
      teamMembers: [],
      clientUsers: [],
      clientFirstName: 'Test',
      clientLastName: 'Test',
      clientEmail: 'test@test.com',
      clientAccess: 'user',
    }, // adds client
    defaultProps, // cancels add client
    {
      ...defaultProps,
      clientUsers: [
        { label: 'team member 1', value: 'uuid-11' },
        { label: 'team member 2', value: 'uuid-12' },
      ],
    }, // shows added users
    {
      ...defaultProps,
      teamMembers: [
        { label: 'team member 1', value: 'uuid-11' },
        { label: 'team member 2', value: 'uuid-12' },
        { label: 'team member 3', value: 'uuid-13' },
      ],
    }, // shows added team members in closed state
    {
      ...defaultProps,
      accountManagers: [
        { label: 'team member 1', value: 'uuid-11' },
        { label: 'team member 2', value: 'uuid-12' },
        { label: 'team member 3', value: 'uuid-13' },
        { label: 'team member 4', value: 'uuid-14' },
      ],
    }, // shows added account managers in closed state
    defaultProps, // closing team toggles users
    defaultProps, // closing users toggles team
  ];

  const states = [
    { createUser: false, addUser: false }, // renders without error
    { createUser: false, addUser: false }, // opens add client
    { createUser: false, addUser: true }, // fails empty client first name
    { createUser: false, addUser: true }, // fails empty client last name
    { createUser: false, addUser: true }, // fails empty client email
    { createUser: false, addUser: true }, // fails invalid client email
    { createUser: false, addUser: true }, // fails empty client email
    { createUser: false, addUser: true }, // fails invalid client telephone
    { createUser: false, addUser: true }, // fails invalid client telephone 2
    { createUser: false, addUser: true }, // clears first name error
    { createUser: false, addUser: true }, // clears last name error
    { createUser: false, addUser: true }, // clears email error
    { createUser: false, addUser: true }, // clears email 2 error
    { createUser: false, addUser: true }, // clears telephone error
    { createUser: false, addUser: true }, // clears telephone 2 error
    { createUser: false, addUser: true }, // adds client
    { createUser: false, addUser: true }, // cancels add client
    { createUser: false, addUser: false }, // shows added users
    { createUser: true, addUser: false }, // shows added team members in closed state
    { createUser: true, addUser: false }, // shows added account managers in closed state
    { createUser: false, addUser: false }, // closing team toggles users
    { createUser: true, addUser: false }, // closing users toggles team
  ];

  beforeEach(() => {
    useStateSpy
      .mockImplementationOnce(() => [states[count].createUser, mockSetCreateUser])
      .mockImplementationOnce(() => [states[count].addUser, mockSetAddUser]);
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

  it('adds client', async () => {
    const submitButton = wrapper.find('[data-test="create-user-button"]');
    await submitButton.simulate('click');
    expect(mockSetClientUsers).toHaveBeenCalledWith([
      { value: '12', label: 'Jane Doe' },
      { value: '13', label: 'Test Test' },
    ]);
    expect(mockSetClient).toHaveBeenCalledTimes(7);
    expect(mockSetAddUser).toHaveBeenCalledWith(false);
  });

  it('cancels add client', () => {
    const cancelAddUser = wrapper.find('[data-test="add-user-actions"]');
    cancelAddUser.props().backHandler();
    expect(mockSetClient).toHaveBeenCalledTimes(7);
    expect(mockSetAddUser).toHaveBeenCalledWith(false);
  });

  it('shows added users', () => {
    const addedUsers = wrapper.find('[data-test="added-client-users"]');
    expect(addedUsers.length).toEqual(2);
  });

  it('shows added team members in closed state', () => {
    const addedTeamMembers = wrapper.find('[id="consultant"]').props().header.props.children[1]
      .props.children[1].props.children[2].props.children;
    expect(addedTeamMembers.length).toEqual(3);
  });

  it('shows added account managers in closed state', () => {
    const addedAccountManagers = wrapper.find('[id="consultant"]').props().header.props.children[1]
      .props.children[2].props.children[1].props.children[1].props.children;
    expect(addedAccountManagers.length).toEqual(4);
  });

  it('closing team toggles users', () => {
    const addedAccountManagers = wrapper.find('[id="consultant"]').props().callback();
    expect(mockSetCreateUser).toHaveBeenCalledWith(true);
  });

  it('closing users toggles team', () => {
    const addedAccountManagers = wrapper.find('[id="client"]').props().callback();
    expect(mockSetCreateUser).toHaveBeenCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
