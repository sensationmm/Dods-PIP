import React from 'react';
import { shallow } from 'enzyme';
import Button from '.';
import * as Styled from './Button.styles';
import Icon from '../Icon';
import { Icons } from '../Icon/assets';

describe('Button', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Button />);
    const component = wrapper.find('[data-test="component-button"]');
    expect(component.length).toEqual(1);
  });
  it('renders primary variant', () => {
    const wrapper = shallow(<Button type={'primary'} />);
    const component = wrapper.find('[data-test="component-button"]');
    const button = wrapper.childAt(0);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.primary.componentStyle.componentId,
    );
  });

  it('renders secondary variant', () => {
    const wrapper = shallow(<Button type={'secondary'} />);
    const component = wrapper.find('[data-test="component-button"]');
    const button = wrapper.childAt(0);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.secondary.componentStyle.componentId,
    );
  });

  it('renders text variant', () => {
    const wrapper = shallow(<Button type={'text'} />);
    const component = wrapper.find('[data-test="component-button"]');
    const button = wrapper.childAt(0);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.text.componentStyle.componentId,
    );
  });

  it('renders icon override', () => {
    const wrapper = shallow(<Button type={'secondary'} icon={Icons.IconAdd} />);
    const component = wrapper.find('[data-test="component-button"]');
    const button = wrapper.childAt(0);

    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.primary.componentStyle.componentId,
    );
  });
});
