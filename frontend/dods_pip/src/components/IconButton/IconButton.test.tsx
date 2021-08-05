import React from 'react';
import { shallow } from 'enzyme';
import IconButton from '.';
import { Icons } from '../Icon/assets';

describe('IconButton', () => {
  it('renders without error', () => {
    const wrapper = shallow(<IconButton icon={Icons.IconAdd} />);
    const component = wrapper.find('[data-test="component-icon-button"]');
    expect(component.length).toEqual(1);
  });
});
