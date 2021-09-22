import { shallow } from 'enzyme';
import React from 'react';

import Label from '.';
import Text from '../../Text';

describe('Label', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Label label="Example" />);
    const component = wrapper.find('[data-test="component-label"]');
    const label = wrapper.find(Text);
    expect(component.length).toEqual(1);
    expect(label.props().children).toEqual('Example');
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
});
