import { shallow } from 'enzyme';
import React from 'react';

import Tagging from './tagging';

describe('Tagging', () => {
  let wrapper, setActiveStep;

  beforeEach(() => {
    setActiveStep = jest.fn();
    wrapper = shallow(<Tagging onSubmit={jest.fn} onBack={jest.fn} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="tagging"]');
    expect(component.length).toEqual(1);
  });
});
