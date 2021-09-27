import { shallow } from 'enzyme';
import React from 'react';

import AccountInfo from './account-info';

describe('AccountInfo', () => {
  let wrapper;

  const setErrors = jest.fn();
  const defaultProps = {
    accountName: '',
    setAccountName: jest.fn,
    accountNotes: '',
    setAccountNotes: jest.fn,
    contactName: '',
    setContactName: jest.fn,
    contactTelephone: '',
    setContactTelephone: jest.fn,
    contactEmail: '',
    setContactEmail: jest.fn,
    onSubmit: jest.fn,
    onBack: jest.fn,
    errors: {},
    setErrors: setErrors,
  };

  beforeEach(() => {
    wrapper = shallow(<AccountInfo {...defaultProps} />);
  });

  it('prevents submission if form empty', () => {
    wrapper = shallow(<AccountInfo {...defaultProps} />);
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails empty account name', () => {
    const input = wrapper.find('[id="account-info-account-name"]');
    input.simulate('blur');
    expect(setErrors).toHaveBeenCalledWith({ accountName: 'This field is required' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails duplicate account name', () => {
    wrapper = shallow(<AccountInfo {...defaultProps} accountName={'somo'} />);
    const input = wrapper.find('[id="account-info-account-name"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({
      accountName: 'An account with this name already exists',
    });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('clears account name error', () => {
    wrapper = shallow(
      <AccountInfo
        {...defaultProps}
        accountName="example"
        errors={{
          accountName: 'error',
        }}
      />,
    );
    const input = wrapper.find('[id="account-info-account-name"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({});
  });

  it('fails empty contact name', () => {
    const input = wrapper.find('[id="account-info-contact-name"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({ contactName: 'This field is required' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('clears contact name error', () => {
    wrapper = shallow(
      <AccountInfo
        {...defaultProps}
        contactName="example"
        errors={{
          contactName: 'error',
        }}
      />,
    );
    const input = wrapper.find('[id="account-info-contact-name"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenLastCalledWith({});
  });

  it('fails empty contact email', () => {
    const input = wrapper.find('[id="account-info-contact-email"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({ contactEmail: 'This field is required' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails invalid contact email', () => {
    wrapper = shallow(<AccountInfo {...defaultProps} contactEmail="test@test" />);
    const input = wrapper.find('[id="account-info-contact-email"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({ contactEmail: 'Invalid format' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('clears contact email error', () => {
    wrapper = shallow(
      <AccountInfo
        {...defaultProps}
        contactEmail="example@example.com"
        errors={{
          contactEmail: 'error',
        }}
      />,
    );
    const input = wrapper.find('[id="account-info-contact-email"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenLastCalledWith({});
  });

  it('fails empty contact phone', () => {
    const input = wrapper.find('[id="account-info-contact-telephone"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({ contactTelephone: 'This field is required' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('fails invalid contact phone', () => {
    wrapper = shallow(<AccountInfo {...defaultProps} contactTelephone="1234567++" />);
    const input = wrapper.find('[id="account-info-contact-telephone"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenCalledWith({ contactTelephone: 'Invalid format' });
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(true);
  });

  it('clears contact phone error', () => {
    wrapper = shallow(
      <AccountInfo
        {...defaultProps}
        contactTelephone="123456789"
        errors={{
          contactTelephone: 'error',
        }}
      />,
    );
    const input = wrapper.find('[id="account-info-contact-telephone"]');
    input.props().onBlur();
    expect(setErrors).toHaveBeenLastCalledWith({});
  });

  it('renders without error and allows submission', () => {
    wrapper = shallow(
      <AccountInfo
        {...defaultProps}
        accountName="example"
        contactName="example"
        contactEmail="example@example.com"
        contactTelephone="123456789"
      />,
    );
    const component = wrapper.find('[data-test="account-info"]');
    expect(component.length).toEqual(1);
    const button = wrapper.find('[data-test="continue-button"]');
    expect(button.props().disabled).toEqual(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
