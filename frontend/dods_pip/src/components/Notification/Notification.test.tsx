import { shallow } from 'enzyme';
import React from 'react';

import Notification from '.';

describe('Notification', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Notification />);
    const component = wrapper.find('[data-test="component-notification"]');
    expect(component.length).toEqual(1);
  });
});
