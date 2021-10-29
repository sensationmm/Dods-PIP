import { shallow, mount } from 'enzyme';
import React from 'react';

import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Button, { ButtonProps } from '.';
import * as Styled from './Button.styles';
import color from '../../globals/color';

describe('Button', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Button />);
    const component = wrapper.find('[data-test="component-button"]');
    expect(component.length).toEqual(1);
  });

  it.each([
    ['primary', Styled.primary],
    ['secondary', Styled.secondary],
    ['text', Styled.text],
  ])('renders `%s` variant', (type, style) => {
    const wrapper = shallow(<Button type={type as ButtonProps['type']} />);
    const button = wrapper.childAt(0);
    expect(button.type().componentStyle.componentId).toEqual(style.componentStyle.componentId);
  });

  it('renders small variant', () => {
    const wrapper = shallow(<Button isSmall />);
    const button = wrapper.childAt(0);
    expect(button.hasClass('small')).toEqual(true);
  });

  it('renders small icon variant', () => {
    const wrapper = shallow(<Button isSmall icon={Icons.Add} />);
    const button = wrapper.childAt(0);
    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.medium);
    expect(button.hasClass('small')).toEqual(true);
  });

  it.each([
    ['primary', Styled.primary],
    ['secondary', Styled.secondary],
  ])('renders `%s` icon variant', (type, style) => {
    const wrapper = shallow(<Button type={type as ButtonProps['type']} icon={Icons.Add} />);
    const button = wrapper.childAt(0);

    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.large);
    expect(button.type().componentStyle.componentId).toEqual(style.componentStyle.componentId);
  });

  it.each([
    ['primary', color.base.greyDark],
    ['text', color.base.greyDark],
  ])('renders `%s` disabled icon variant', (type, iconColor) => {
    const wrapper = shallow(
      <Button icon={Icons.Add} type={type as ButtonProps['type']} disabled />,
    );
    const icon = wrapper.find(Icon);
    expect(icon.props().color).toEqual(iconColor);
  });

  describe('verify click event', () => {
    const onClick = jest.fn();

    it('by default can click', () => {
      const wrapper = mount(<Button label="Label" onClick={onClick} />);
      const button = wrapper.find('button');
      button.simulate('click');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('when disabled cannot click', () => {
      const wrapper = mount(<Button label="Label" onClick={onClick} disabled={true} />);
      const button = wrapper.find('button');
      button.simulate('click');

      expect(onClick).toHaveBeenCalledTimes(0);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
