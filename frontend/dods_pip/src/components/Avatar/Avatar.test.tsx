import { shallow } from 'enzyme';
import React from 'react';

import Avatar from '.';
import * as Styled from './Avatar.styles';

describe('Avatar', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Avatar type='client' size='medium' />);
    const component = wrapper.find('[data-test="component-avatar"]');
    expect(component.length).toEqual(1);
  });
});
