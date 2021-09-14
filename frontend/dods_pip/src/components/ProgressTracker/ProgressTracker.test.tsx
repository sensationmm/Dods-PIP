import { shallow } from 'enzyme';
import React from 'react';

import ProgressTracker from '.';

describe('ProgressTracker', () => {
  it('renders without error', () => {
    const wrapper = shallow(<ProgressTracker />);
    const component = wrapper.find('[data-test="component-progress-tracker"]');
    expect(component.length).toEqual(1);
  });
});
