import { shallow } from 'enzyme';
import React from 'react';

import AlfabeticalFilter from '.';

describe('AZ Filter', () => {
  it('renders without error', () => {
    const wrapper = shallow(<AlfabeticalFilter />);
    const component = wrapper.find('[data-test="component-AZFilter"]');
    expect(component.length).toEqual(1);
  }); 
});
