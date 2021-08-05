import React from 'react';
import { shallow } from 'enzyme';
import Columns from '.';

describe('Columns', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Columns />);
    const component = wrapper.find('[data-test="component-columns"]');
    expect(component.length).toEqual(1);
  });
});
