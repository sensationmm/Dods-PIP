import { shallow } from 'enzyme';
import React from 'react';

import AccountInfo from './account-info';

describe('AccountInfo', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <AccountInfo
        accountName={'accountName'}
        setAccountName={jest.fn}
        accountNotes={'accountNotes'}
        setAccountNotes={jest.fn}
        contactName={'contactName'}
        setContactName={jest.fn}
        contactTelephone={'contactTelephone'}
        setContactTelephone={jest.fn}
        contactEmail={'contactEmail'}
        setContactEmail={jest.fn}
        onSubmit={jest.fn}
        onBack={jest.fn}
        errors={{}}
      />,
    );
  });

  it('renders without error and allows submission', () => {
    const component = wrapper.find('[data-test="account-info"]');
    expect(component.length).toEqual(1);
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(false);
  });

  it('prevents submission if form empty', () => {
    wrapper = shallow(
      <AccountInfo
        accountName={''}
        setAccountName={jest.fn}
        accountNotes={''}
        setAccountNotes={jest.fn}
        contactName={''}
        setContactName={jest.fn}
        contactTelephone={''}
        setContactTelephone={jest.fn}
        contactEmail={''}
        setContactEmail={jest.fn}
        onSubmit={jest.fn}
        onBack={jest.fn}
        errors={{}}
      />,
    );
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
