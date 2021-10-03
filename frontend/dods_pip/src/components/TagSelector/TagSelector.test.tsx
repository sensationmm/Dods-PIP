import { shallow } from 'enzyme';
import React from 'react';

import TagSelector from '.';

describe('TagSelector', () => {
  it('renders without error', () => {
    const wrapper = shallow(<TagSelector />);
    const component = wrapper.find('[data-test="component-tag-selector"]');
    expect(component.length).toEqual(1);
  });
});
