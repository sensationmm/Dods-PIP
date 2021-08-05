import React from 'react';
import { shallow } from 'enzyme';
import Header from '.';

describe('Header', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Header />);
    const component = wrapper.find('[data-test="component-header"]');
    expect(component.length).toEqual(1);
  });
});
