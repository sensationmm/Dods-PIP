import { shallow } from 'enzyme';
import React from 'react';

import DatePicker from '.';

describe('DatePicker', () => {
  it('renders without error', () => {
    const wrapper = shallow(<DatePicker />);
    const component = wrapper.find('[data-test="component-date-picker"]');
    expect(component.length).toEqual(1);
  });
});
