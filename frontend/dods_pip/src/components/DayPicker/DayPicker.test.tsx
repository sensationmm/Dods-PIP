import { shallow } from 'enzyme';
import React from 'react';

import DayPicker from '.';

describe('DayPicker', () => {
  let wrapper;
  const onClick = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<DayPicker onClick={onClick} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-day-picker"]');
    expect(component.length).toEqual(1);
  });

  it('calls onClick if provided', () => {
    const day = wrapper.find('[data-test="day-WED"]');
    day.simulate('click');
    expect(onClick).toHaveBeenCalledWith(['WED']);
  });

  it('does not call onClick if not provided', () => {
    wrapper = shallow(<DayPicker />);
    const day = wrapper.find('[data-test="day-WED"]');
    day.simulate('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
