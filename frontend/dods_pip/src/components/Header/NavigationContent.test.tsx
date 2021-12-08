import { shallow } from 'enzyme';
import React from 'react';

import NavigationContent from './NavigationContent';

export const contentMenu = [
  { label: 'Repository', url: 'editorial' },
  { label: 'Library', url: 'library' },
  { label: 'People', url: 'people' },
  { label: 'Collections', url: 'collections' },
];

const mockNavHovered = jest.fn();

const props = {
  user: {},
  contentMenu: contentMenu,
  rootPage: 'Test',
  navHovered: false,
  setNavHovered: mockNavHovered,
};

describe('NavigationContent', () => {
  it('renders without error', () => {
    const wrapper = shallow(<NavigationContent {...props} />);
    const component = wrapper.find('[data-test="navigation-content"]');
    expect(component.length).toEqual(1);
  });

  it('sets nav hovered', () => {
    const wrapper = shallow(<NavigationContent {...props} />);
    const component = wrapper.find('[data-test="navigation-content"]');
    component.simulate('mouseEnter');
    expect(mockNavHovered).toHaveBeenCalledWith(true);
  });

  it('sets nav unhovered', () => {
    const wrapper = shallow(<NavigationContent {...props} />);
    const component = wrapper.find('[data-test="navigation-content"]');
    component.simulate('mouseLeave');
    expect(mockNavHovered).toHaveBeenCalledWith(false);
  });
});
