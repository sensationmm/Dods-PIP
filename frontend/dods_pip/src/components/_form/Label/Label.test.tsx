import { shallow } from 'enzyme';
import React from 'react';

import Label from '.';
import Text from '../../Text';
import color from '../../../globals/color';

describe('Label', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Label label="Example" />);
    const component = wrapper.find('[data-test="component-label"]');
    const label = wrapper.find(Text);
    expect(component.length).toEqual(1);
    expect(label.props().children).toEqual(['Example', undefined]);
  });

  it('renders required state', () => {
    const wrapper = shallow(<Label label="Example" required={true} />);
    const required = wrapper.find('[data-test="label-required"]');
    const requiredStar = wrapper.find('[data-test="label-required-star"]');
    expect(required.text()).toEqual('(Required)');
    expect(requiredStar.length).toEqual(1);
  });

  it('renders optional state', () => {
    const wrapper = shallow(<Label label="Example" optional={true} />);
    const required = wrapper.find('[data-test="label-required"]');
    const requiredStar = wrapper.find('[data-test="label-required-star"]');
    expect(required.text()).toEqual('(Optional)');
    expect(requiredStar.length).toEqual(0);
  });

  it("should display with bold state", () => {
    const wrapper = shallow(<Label label="Example" bold />)
    const component  = wrapper.find('[data-test="text-component"]')
    expect(component.find(Text).props().bold).toEqual(true)
  })

  it("should display with disabled state", () => {
    const wrapper = shallow(<Label label="Example" bold isDisabled />)
    const component  = wrapper.find('[data-test="text-component"]')
    expect(component.find(Text).props().color).toEqual(color.base.greyDark)
  })

  it("should display with light color in darkMode", () => {
    const wrapper = shallow(<Label label="Example" bold darkMode/>)
    const component  = wrapper.find('[data-test="text-component"]')
    expect(component.find(Text).props().color).toEqual(color.base.white)
  })
});
