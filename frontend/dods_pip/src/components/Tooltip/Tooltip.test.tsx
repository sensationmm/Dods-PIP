import { shallow } from 'enzyme';
import React from 'react';

import Tooltip, { alignmentType, colorMode } from '.';
import { Icons } from '../Icon/assets';

describe('Tooltips', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Tooltip alignment="topLeft" colorType="Light" />);
    const component = wrapper.find('[data-test="component-tooltip"]');
    const title = wrapper.find('[data-test="component-title"]');
    expect(title.length).toEqual(0);
    const icon = wrapper.find('[data-test="component-icon"]');
    expect(icon.length).toEqual(0);
    expect(component.length).toEqual(1);
  });

  it('renders with a title if specified', () => {
    const wrapper = shallow(<Tooltip title="Title lorem ipsum" />);
    const title = wrapper.find('[data-test="component-title"]');
    expect(title.length).toEqual(1);
  });

  it.each([
    ['light', 'Light', '.colorLight'],
    ['dark', 'Dark', '.colorDark'],
  ])('renders with icon if specified and color variation %s', (name, prop, selector) => {
    const wrapper = shallow(<Tooltip icon={prop as Icons} colorType={prop as colorMode} />);
    const icon = wrapper.find('[data-test="component-icon"]');
    expect(icon.length).toEqual(1);
  });

  it.each([
    ['light', 'Light', '.colorLight'],
    ['dark', 'Dark', '.colorDark'],
  ])('renders color variation %s', (name, prop, selector) => {
    const wrapper = shallow(<Tooltip alignment="topLeft" colorType={prop as colorMode} />);
    const component = wrapper.find(selector);
    expect(component.length).toEqual(1);
  });

  it.each([
    ['top left', 'topLeft', '.alignTopLeft'],
    ['top right', 'topRight', '.alignTopRight'],
    ['right', 'right', '.alignRight'],
  ])('renders default variation align %s', (name, props, selector) => {
    const wrapper = shallow(<Tooltip alignment={props as alignmentType} colorType="Light" />);
    const component = wrapper.find(selector);

    expect(component.length).toEqual(1);
  });
});
