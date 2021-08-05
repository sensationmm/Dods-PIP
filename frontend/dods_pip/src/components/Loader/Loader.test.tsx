import React from 'react';
import { shallow } from 'enzyme';
import Loader from '.';

describe('Loader', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Loader />);
    const component = wrapper.find('[data-test="component-loader"]');
    expect(component.length).toBe(1);
  });
});
