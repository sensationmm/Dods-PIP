import { shallow } from 'enzyme';
import React from 'react';

import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Button from '.';
import * as Styled from './Button.styles';

describe('Button', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Button />);
    const component = wrapper.find('[data-test="component-button"]');
    expect(component.length).toEqual(1);
  });

  it('renders primary variant', () => {
    const wrapper = shallow(<Button type={'primary'} />);
    const button = wrapper.childAt(0);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.primary.componentStyle.componentId,
    );
  });

  it('renders secondary variant', () => {
    const wrapper = shallow(<Button type={'secondary'} />);
    const button = wrapper.childAt(0);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.secondary.componentStyle.componentId,
    );
  });

  it('renders text variant', () => {
    const wrapper = shallow(<Button type={'text'} />);
    const button = wrapper.childAt(0);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.text.componentStyle.componentId,
    );
  });

  it('renders small variant', () => {
    const wrapper = shallow(<Button isSmall />);
    const button = wrapper.childAt(0);
    expect(button.hasClass('small')).toEqual(true);
  });

  it('renders small variant', () => {
    const wrapper = shallow(<Button isSmall icon={Icons.IconAdd} />);
    const button = wrapper.childAt(0);
    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.medium);
    expect(button.hasClass('small')).toEqual(true);
  });

  it('renders primary icon variant', () => {
    const wrapper = shallow(<Button type={'primary'} icon={Icons.IconAdd} />);
    const button = wrapper.childAt(0);

    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.large);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.primary.componentStyle.componentId,
    );
  });

  it('renders secondary icon variant', () => {
    const wrapper = shallow(<Button type={'secondary'} icon={Icons.IconAdd} />);
    const button = wrapper.childAt(0);

    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.large);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.secondary.componentStyle.componentId,
    );
  });
});
