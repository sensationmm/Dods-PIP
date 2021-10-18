import { shallow } from 'enzyme';
import React from 'react';

import Tooltip from '.';

describe('Tooltips', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Tooltip alignment='topLeft' colorType='Light' />);
    const component = wrapper.find('[data-test="component-tooltip"]');
    expect(component.length).toEqual(1);
  });

  it('renders default variation align top left', () => {
    const wrapper = shallow(<Tooltip alignment='topLeft' colorType='Light' />);
    const component = wrapper.find('.alignTopLeft');
    expect(component.length).toEqual(1);
  });

  it('renders variation align top Right', () => {
    const wrapper = shallow(<Tooltip alignment='topRight' colorType='Light' />);
    const component = wrapper.find('.alignTopRight');
    expect(component.length).toEqual(1);
  });

  it('renders variation align right', () => {
    const wrapper = shallow(<Tooltip alignment='right' colorType='Light' />);
    const component = wrapper.find('.alignRight');
    expect(component.length).toEqual(1);
  });

  it('renders default light background', () => {
    const wrapper = shallow(<Tooltip alignment='topLeft' colorType='Light' />);
    const component = wrapper.find('.colorLight');
    expect(component.length).toEqual(1);
  });

  it('renders dark background', () => {
    const wrapper = shallow(<Tooltip alignment='topLeft' colorType='Dark' />);
    const component = wrapper.find('.colorDark');
    expect(component.length).toEqual(1);
  });
});
