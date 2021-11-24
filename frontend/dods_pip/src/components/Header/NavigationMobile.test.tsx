import { shallow } from 'enzyme';
import { useReducer } from 'hoist-non-react-statics/node_modules/@types/react';
import React from 'react';

import NavigationMobile from './NavigationMobile';

const mockActive = jest.fn();

const props = {
  user: { isDodsUser: true },
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
    ['dods', true],
    ['accounts', true],
    ['users', true],
    ['account', false],
    ['profile', false],
  ])('clicks %p menu item', (label, isDodsUser) => {
    const wrapper = shallow(<NavigationMobile {...props} user={{ ...props.user, isDodsUser }} />);
    const menuItem = wrapper.find(`[data-test="menu-item-${label}"]`);
    menuItem.simulate('click');
    expect(mockActive).toHaveBeenCalledWith(false);
  });
});
