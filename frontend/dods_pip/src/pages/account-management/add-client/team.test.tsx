import { shallow } from 'enzyme';
import React from 'react';

import Team from './team';

describe('Team', () => {
  let wrapper, setActiveStep;

  beforeEach(() => {
    setActiveStep = jest.fn();
    wrapper = shallow(<Team onSubmit={jest.fn} onBack={jest.fn} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="team"]');
    expect(component.length).toEqual(1);
  });
});
