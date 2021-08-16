import { shallow } from 'enzyme';
import React from 'react';

import Icon from '.';
import { Icons } from './assets';

describe('Icon', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Icon src={Icons.IconCross} />);
    const component = wrapper.find('[data-test="component-icon"]');
    expect(component.length).toEqual(1);
  });
});
