import { shallow } from 'enzyme';
import React from 'react';

import Columns from '.';

describe('Columns', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Columns />);
    const component = wrapper.find('[data-test="component-columns"]');
    expect(component.length).toEqual(1);
  });
});
