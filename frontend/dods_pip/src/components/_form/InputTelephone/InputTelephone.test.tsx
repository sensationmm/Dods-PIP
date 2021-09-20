import { shallow } from 'enzyme';
import React from 'react';

import InputTelephone from '.';

describe('InputTelephone', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <InputTelephone id="test" label="Example" value={'Example'} onChange={jest.fn} />,
    );
    const component = wrapper.find('[data-test="component-input-telephone"]');
    expect(component.length).toEqual(1);
  });

  it('fires onChange method', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(
      <InputTelephone id="test" label="Example" value={''} onChange={typeWatcher} />,
    );
    const component = wrapper.find('[data-test="component-input-telephone"]');
    component.simulate('focus');
    component.simulate('change', '123456789');
    expect(typeWatcher).toHaveBeenCalledTimes(1);
    expect(typeWatcher).toHaveBeenCalledWith('123456789');
  });

  it('prevents non-phone characters', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(
      <InputTelephone id="test" label="Example" value={''} onChange={typeWatcher} />,
    );
    const component = wrapper.find('[data-test="component-input-telephone"]');
    component.simulate('focus');
    component.simulate('change', '123456789asd');
    expect(typeWatcher).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
