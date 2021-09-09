import { shallow } from 'enzyme';
import React from 'react';

import Select from '.';

describe('Select', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Select />);
    const component = wrapper.find('[data-test="component-select"]');
    expect(component.length).toEqual(1);
  });
});
