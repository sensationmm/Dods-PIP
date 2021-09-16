import { shallow } from 'enzyme';
import React from 'react';

import AccountInfo from './account-info';

describe('AccountInfo', () => {
  let wrapper;

  beforeEach(() => {
    const setAccountName = jest.fn();
    const setAccountNotes = jest.fn();
    const setContactName = jest.fn();
    const setContactTelephone = jest.fn();
    const setContactEmail = jest.fn();
    const setActiveStep = jest.fn();
    wrapper = shallow(
      <AccountInfo
        accountName={'accountName'}
        setAccountName={setAccountName}
        accountNotes={'accountNotes'}
        setAccountNotes={setAccountNotes}
        contactName={'contactName'}
        setContactName={setContactName}
        contactTelephone={'contactTelephone'}
        setContactTelephone={setContactTelephone}
        contactEmail={'contactEmail'}
        setContactEmail={setContactEmail}
        setActiveStep={setActiveStep}
      />,
    );
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="account-info"]');
    expect(component.length).toEqual(1);
  });
});
