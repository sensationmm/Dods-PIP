import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import { Dashboard } from './dashboard.page';

const loadingSpy = jest.fn();
const mockMutateUserSpy = jest.fn();
jest.mock('../lib/useUser', () => {
  return jest
    .fn()
    .mockImplementationOnce(() => {
      return { user: { isLoggedIn: false }, mutateUser: mockMutateUserSpy };
    })
    .mockImplementation(() => {
      return { user: { isLoggedIn: true }, mutateUser: mockMutateUserSpy };
    });
});

jest.mock('../lib/fetchJson', () => {
  return jest.fn().mockReturnValue(true);
});

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

describe('Dashboard', () => {
  it('renders loader while finding login', () => {
    const wrapper: ShallowWrapper = shallow(
      <Dashboard isLoading={false} setLoading={jest.fn} addNotification={jest.fn} />,
    );
    const component = wrapper.find('[data-test="loader"]');
    expect(component.length).toEqual(1);
  });

  it('renders without error', () => {
    const wrapper: ShallowWrapper = shallow(
      <Dashboard isLoading={false} setLoading={jest.fn} addNotification={jest.fn} />,
    );
    const component = wrapper.find('[data-test="page-dashboard"]');
    expect(component.length).toEqual(1);
  });

  it('signs out when button clicks', () => {
    const wrapper: ShallowWrapper = shallow(
      <Dashboard isLoading={false} setLoading={loadingSpy} addNotification={jest.fn} />,
    );
    const button = wrapper.find('[data-test="logout-button"]');
    button.simulate('click');
    expect(loadingSpy).toHaveBeenCalledTimes(1);
  });
});
