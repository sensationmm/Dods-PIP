import { shallow } from 'enzyme';
import React from 'react';

import NavigationMobile from './NavigationMobile';
import { dodsMenu } from './NavigationAccount.test';
import { contentMenu } from './NavigationContent.test';

const mockActive = jest.fn();

const props = {
  user: { isDodsUser: true },
  dodsMenu: dodsMenu,
  contentMenu: contentMenu,
  rootPage: 'Test',
  navHovered: false,
  setNavHovered: jest.fn,
  active: true,
  setActive: mockActive,
  logout: jest.fn,
};

const mockDodsMenuOpen = jest.fn();
jest.spyOn(React, 'useState').mockImplementation(() => [true, mockDodsMenuOpen]);

describe('NavigationMobile', () => {
  it('renders without error', () => {
    const wrapper = shallow(<NavigationMobile {...props} />);
    const component = wrapper.find('[data-test="navigation-mobile"]');
    expect(component.length).toEqual(1);
  });

  it('triggers dods menu', () => {
    const wrapper = shallow(<NavigationMobile {...props} />);
    const menuItem = wrapper.find('[data-test="dods-menu"]');
    menuItem.simulate('click');
    expect(mockDodsMenuOpen).toHaveBeenCalledWith(false);
  });

  it.each([
    ['dods', true, 0],
    ['accounts', true, 1],
    ['users', true, 2],
    ['account', false, 'account'],
    ['profile', false, 'profile'],
  ])('clicks %p menu item', (label, isDodsUser, count) => {
    const wrapper = shallow(<NavigationMobile {...props} user={{ ...props.user, isDodsUser }} />);
    const menuItem = wrapper.find(`[data-test="menu-item-${count}"]`);
    menuItem.simulate('click');
    expect(mockActive).toHaveBeenCalledWith(false);
  });
});
