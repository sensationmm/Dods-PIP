import { shallow } from 'enzyme';
import React from 'react';

import NavigationAccount from './NavigationAccount';

const mockNavHovered = jest.fn();
const mockAccountMenuOpen = jest.fn();
const mockDodsMenuOpen = jest.fn();

const props = {
  user: { isDodsUser: true },
  rootPage: 'Test',
  navHovered: false,
  setNavHovered: mockNavHovered,
  accountMenuOpen: false,
  setAccountMenuOpen: mockAccountMenuOpen,
  dodsMenuOpen: false,
  setDodsMenuOpen: mockDodsMenuOpen,
  logout: jest.fn,
};

describe('NavigationAccount', () => {
  it('renders without error', () => {
    const wrapper = shallow(<NavigationAccount {...props} />);
    const component = wrapper.find('[data-test="navigation-account"]');
    expect(component.length).toEqual(1);
  });

  it.each([
    ['sets nav hovered', 'navigation', 'mouseEnter', mockNavHovered, true, false],
    ['sets nav unhovered', 'navigation', 'mouseLeave', mockNavHovered, false, false],
    ['sets nav hovered from account nav', 'account-nav', 'mouseEnter', mockNavHovered, true, false],
    [
      'sets nav unhovered from account nav',
      'account-nav',
      'mouseLeave',
      mockNavHovered,
      false,
      false,
    ],
    ['triggers account menu', 'account-trigger', 'click', mockAccountMenuOpen, true, false],
    ['triggers dods menu', 'dods-nav', 'click', mockDodsMenuOpen, true, true],
  ])('%p', (label, element, event, mockFunc, expected, isDodsUser) => {
    const wrapper = shallow(<NavigationAccount {...props} user={{ ...props.user, isDodsUser }} />);
    const component = wrapper.find(`[data-test="${element}"]`);
    component.simulate(event);
    expect(mockFunc).toHaveBeenCalledWith(expected);
  });
});
