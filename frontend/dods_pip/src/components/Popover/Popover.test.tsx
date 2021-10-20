import { shallow, mount } from 'enzyme';
import React from 'react';
import Popover from '.';

describe('Popover', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Popover />);
    const component = wrapper.find('[data-test="popover"]');
    expect(component.length).toEqual(1);
  });

  it('simulates click events', () => {
    const wrapper = mount(<Popover />);
    const btn = wrapper.find('.btnTrigger');
    btn.simulate('click');
    expect(wrapper.find('.show').length).toEqual(2);
    btn.simulate('click');
    expect(wrapper.find('.show').length).toEqual(0);
  });
});
