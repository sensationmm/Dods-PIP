import { shallow } from 'enzyme';
import React from 'react';

import Box from '.';

describe('Box', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Box />);
    const component = wrapper.find('[data-test="component-box"]');
    expect(component.length).toEqual(1);
  });
});
