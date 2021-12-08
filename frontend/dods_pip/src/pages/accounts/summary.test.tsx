import { shallow } from 'enzyme';
import React from 'react';

import Summary from './summary';

jest.mock('../../lib/fetchJson', () => {
  return jest
    .fn()
    .mockImplementationOnce(() =>
      Promise.resolve(mockSubscriptionList)
    ).mockImplementationOnce(() =>
      Promise.resolve({ success: true })
    )
});

describe('Summary page', () => {
  const defaultProps = {
    accountId: 'exampleid1',
    accountName: 'Somo Global',
    accountNotes: '',
    contactName: '',
    contactTelephone: '',
    contactEmail: '',
    isUK: false,
    isEU: true,
    subscriptionType: '',
    userSeats: '',
    consultantHours: '',
    renewalType: '',
    team: [],
    startDate: 'Nov 05 2021 11:30:32',
    endDate: 'Nov 05 2022 11:30:32',
    endDateType: '',
  }

  it('renders without error', () => {
    const wrapper = shallow(<Summary {...defaultProps} />);
    const component = wrapper.find('[data-test="summary"]');
    expect(component.length).toEqual(1);
  });
});
