import React from 'react';
import { shallow } from 'enzyme';
import Spacer from '.';

describe('Spacer', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Spacer />);
    const component = wrapper.find('[data-test="component-spacer"]');
    expect(component.length).toEqual(1);
  });
});
