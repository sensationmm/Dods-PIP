import { shallow } from 'enzyme';
import React from 'react';

import Icon, { IconSize } from '../Icon';
import Text from '../Text';
import Avatar from '.';
import * as Styled from './Avatar.styles';
import color from '../../globals/color';

describe('Avatar', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Avatar type="client" size="medium" />);
    const component = wrapper.find('[data-test="component-avatar"]');
    expect(component.length).toEqual(1);
  });

  it('renders small icon variant', () => {
    const wrapper = shallow(<Avatar type="client" size="small" />);
    const icon = wrapper.find(Icon);
    expect(icon.props().size).toEqual(IconSize.small);
    expect(icon.props().color).toEqual(color.base.white);
  });

  it('renders medium icon variant', () => {
    const wrapper = shallow(<Avatar type="client" size="medium" />);
    const icon = wrapper.find(Icon);
    expect(icon.props().size).toEqual(IconSize.medium);
  });

  it('renders large icon variant', () => {
    const wrapper = shallow(<Avatar type="client" size="large" />);
    const icon = wrapper.find(Icon);
    expect(icon.props().size).toEqual(IconSize.large);
  });

  it('renders small text variant', () => {
    const wrapper = shallow(<Avatar type="client" number={1} size="small" />);
    const text = wrapper.find(Text);
    expect(text.props().type).toEqual('bodySmall');
  });

  it('renders medium text variant', () => {
    const wrapper = shallow(<Avatar type="client" number={1} size="medium" />);
    const text = wrapper.find(Text);
    expect(text.props().type).toEqual('body');
  });

  it('renders large text variant', () => {
    const wrapper = shallow(<Avatar type="client" number={1} size="large" />);
    const text = wrapper.find(Text);
    expect(text.props().type).toEqual('bodyLarge');
  });

  it('renders disabled variant', () => {
    const wrapper = shallow(<Avatar type="client" disabled size="large" />);
    const text = wrapper.find(Text);
    const icon = wrapper.find(Icon);
    expect(text.length).toEqual(0);
    expect(icon.props().color).toEqual(color.base.grey);
  });
});
