import { shallow } from 'enzyme';
import React from 'react';

import SelectMulti from '.';

describe('SelectMulti', () => {
  it('renders without error', () => {
    const wrapper = shallow(<SelectMulti />);
    const component = wrapper.find('[data-test="component-select-multi"]');
    expect(component.length).toEqual(1);
  });
});
