import { shallow } from 'enzyme';
import React from 'react';

import Tooltip from '.';

describe('Tooltips', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Tooltip alignment='topLeft' colorType='Light' />);
    const component = wrapper.find('[data-test="component-tooltip"]');
    expect(component.length).toEqual(1);
  });
});
