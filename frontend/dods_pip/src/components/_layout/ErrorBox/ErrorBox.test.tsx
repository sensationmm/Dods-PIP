import React from 'react';
import { shallow } from 'enzyme';
import ErrorBox from '.';

describe('ErrorBox', () => {
  it('renders without error', () => {
    const wrapper = shallow(<ErrorBox />);
    const component = wrapper.find('[data-test="component-error-box"]');
    expect(component.length).toEqual(1);
  });
});
