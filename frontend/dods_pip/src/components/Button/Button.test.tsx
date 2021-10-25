import { shallow, mount } from 'enzyme';
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
    const wrapper = shallow(<Button isSmall icon={Icons.Add} />);
    const button = wrapper.childAt(0);
    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.medium);
    expect(button.hasClass('small')).toEqual(true);
  });

  it('renders primary icon variant', () => {
    const wrapper = shallow(<Button type={'primary'} icon={Icons.Add} />);
    const button = wrapper.childAt(0);

    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.large);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.primary.componentStyle.componentId,
    );
  });

  it('renders secondary icon variant', () => {
    const wrapper = shallow(<Button type={'secondary'} icon={Icons.Add} />);
    const button = wrapper.childAt(0);

    const icon = wrapper.find(Icon);

    expect(icon.length).toEqual(1);
    expect(icon.props().size).toEqual(IconSize.large);
    expect(button.type().componentStyle.componentId).toEqual(
      Styled.secondary.componentStyle.componentId,
    );
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
