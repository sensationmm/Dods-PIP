import { shallow } from 'enzyme';
import React from 'react';

import Footer from '.';

describe('Footer', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Footer />);
    const component = wrapper.find('[data-test="component-footer"]');
    expect(component.length).toEqual(1);
  });
});
