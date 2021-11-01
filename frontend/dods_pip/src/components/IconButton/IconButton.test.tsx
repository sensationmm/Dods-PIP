import { shallow } from 'enzyme';
import React from 'react';

import * as Styled from '../Button/Button.styles';
import { Icons } from '../Icon/assets';
import Icon, { IconSize } from '../Icon';
import IconButton, { IconButtonProps } from '.';
import color from '../../globals/color';

describe('IconButton', () => {
  it('renders without error', () => {
    const wrapper = shallow(<IconButton />);
    const component = wrapper.find('[data-test="component-icon-button"]');
    expect(component.length).toEqual(1);
  });

  it.each([
    ['primary', Styled.primary, IconSize.large, color.base.white],
    ['secondary', Styled.secondary, IconSize.large, color.theme.blueMid],
    ['text', Styled.text, IconSize.xlarge, color.theme.blueMid],
  ])('renders `%s` variant', (type, style, iconSize, iconColor) => {
    const wrapper = shallow(<IconButton icon={Icons.Add} type={type as IconButtonProps['type']} />);
    const button = wrapper.childAt(0);
    const icon = wrapper.find(Icon);
    expect(button.type().componentStyle.componentId).toEqual(style.componentStyle.componentId);
    expect(icon.props().size).toEqual(iconSize);
    expect(icon.props().color).toEqual(iconColor);
  });

  it.each([
    ['primary', IconSize.medium],
    ['text', IconSize.mediumLarge],
  ])('renders `%s` small variant', (type, iconSize) => {
    const wrapper = shallow(
      <IconButton icon={Icons.Add} type={type as IconButtonProps['type']} isSmall />,
    );
    const icon = wrapper.find(Icon);
    expect(icon.props().size).toEqual(iconSize);
  });

  it.each([
    ['primary', color.base.greyDark],
    ['text', color.base.greyDark],
  ])('renders `%s` disabled variant', (type, iconColor) => {
    const wrapper = shallow(
      <IconButton icon={Icons.Add} type={type as IconButtonProps['type']} disabled />,
    );
    const icon = wrapper.find(Icon);
    expect(icon.props().color).toEqual(iconColor);
  });
});
