import { shallow } from 'enzyme';
import React from 'react';

import Chips from '.';

describe('Core/Chips', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Chips label="Simple" />);
    const component = wrapper.find('[data-test="component-chip"]');
    expect(component.length).toEqual(1);
  });
});
