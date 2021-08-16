import { shallow } from 'enzyme';
import React from 'react';

import Spacer from '.';

describe('Spacer', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Spacer />);
    const component = wrapper.find('[data-test="component-spacer"]');
    expect(component.length).toEqual(1);
  });
});
