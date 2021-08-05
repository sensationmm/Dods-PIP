import React from 'react';
import { shallow } from 'enzyme';
import Box from '.';

describe('Box', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Box />);
    const component = wrapper.find('[data-test="component-box"]');
    expect(component.length).toEqual(1);
  });
});
