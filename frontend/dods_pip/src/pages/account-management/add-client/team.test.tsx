import { shallow } from 'enzyme';
import React from 'react';

import Team from './team';

describe('Team', () => {
  let wrapper, setActiveStep;

  const defaultProps = {
    teamMembers: [],
    setTeamMembers: jest.fn,
    accountManagers: [],
    setAccountManagers: jest.fn,
    clientUsers: [],
    setClientUsers: jest.fn,
    clientFirstName: '',
    setClientFirstName: jest.fn,
    clientLastName: '',
    setClientLastName: jest.fn,
    clientJobTitle: '',
    setClientJobTitle: jest.fn,
    clientEmail: '',
    setClientEmail: jest.fn,
    clientEmail2: '',
    setClientEmail2: jest.fn,
    clientTelephone: '',
    setClientTelephone: jest.fn,
    clientTelephone2: '',
    setClientTelephone2: jest.fn,
    errors: '',
    setErrors: jest.fn,
    onSubmit: jest.fn,
    onBack: jest.fn,
  };

  beforeEach(() => {
    setActiveStep = jest.fn();
    wrapper = shallow(<Team {...defaultProps} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="team"]');
    expect(component.length).toEqual(1);
  });
});
