import { shallow } from 'enzyme';
import React from 'react';

import Subscription from './subscription';

describe('Subscription', () => {
  let wrapper, setActiveStep;

  beforeEach(() => {
    setActiveStep = jest.fn();
    wrapper = shallow(<Subscription onSubmit={jest.fn} onBack={jest.fn} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="subscription"]');
    expect(component.length).toEqual(1);
  });
});
