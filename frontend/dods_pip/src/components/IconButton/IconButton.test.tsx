import { shallow } from 'enzyme';
import React from 'react';

import { Icons } from '../Icon/assets';
import IconButton from '.';

describe('IconButton', () => {
  it('renders without error', () => {
    const wrapper = shallow(<IconButton icon={Icons.IconAdd} />);
    const component = wrapper.find('[data-test="component-icon-button"]');
    expect(component.length).toEqual(1);
  });
});
