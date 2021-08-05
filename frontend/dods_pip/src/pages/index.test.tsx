import React from 'react';
import { shallow } from 'enzyme';
import Index from './index.page';

describe('Index', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Index />);
    const component = wrapper.find('[data-test="page-home"]');
    expect(component.length).toEqual(1);
  });
});
