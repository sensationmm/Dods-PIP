import { shallow } from 'enzyme';
import React from 'react';
import Popover from '.';

describe('Popover', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Popover />);
    const component = wrapper.find('[data-test="popover"]');
    expect(component.length).toEqual(1);
  });
});
