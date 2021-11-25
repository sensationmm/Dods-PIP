import { shallow } from 'enzyme';
import React from 'react';

import StickyEffect from './';

describe('Sticky effect', () => {
  it('renders without error', () => {
    const wrapper = shallow(<StickyEffect yAxisLimit={200} yAxis={100} />);
    const component = wrapper.find('[data-test="component-sticky-footer"]');
    expect(component.length).toEqual(1);
  });


});
