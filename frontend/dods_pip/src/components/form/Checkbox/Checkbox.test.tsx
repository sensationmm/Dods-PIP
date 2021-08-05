import React from 'react';
import { shallow } from 'enzyme';
import Checkbox from '.';

const clickWatcher = jest.fn();
const preventDefaultMock = jest.fn();

describe('Checkbox', () => {
  it('renders without error in the default state', () => {
    const wrapper = shallow(<Checkbox id="test" label="Example" onChange={() => {}} />);
    const component = wrapper.find('[data-test="component-checkbox"]');
    expect(component.length).toEqual(1);
  });

  it('renders without error in active state', () => {
    const wrapper = shallow(
      <Checkbox id="test" label="Example" isChecked={true} onChange={clickWatcher} />,
    );
    const component = wrapper.find('[data-test="component-checkbox"]');
    expect(component.length).toEqual(1);
  });

  it('renders without error in disabled state and is unclickable', () => {
    const wrapper = shallow(
      <Checkbox id="test" label="Example" isDisabled={true} onChange={clickWatcher} />,
    );
    const component = wrapper.find('[data-test="component-checkbox"]');
    expect(component.length).toEqual(1);

    const input = wrapper.find('[data-test="component-checkbox-layout"]');
    input.simulate('click');
    expect(clickWatcher).toHaveBeenCalledTimes(0);
  });

  it('registers click', () => {
    const wrapper = shallow(<Checkbox id="test" label="Example" onChange={clickWatcher} />);
    const component = wrapper.find('[data-test="component-checkbox-layout"]');
    component.simulate('click');
    expect(clickWatcher).toHaveBeenCalledTimes(1);
  });

  it('registers spacebar', () => {
    const wrapper = shallow(<Checkbox id="test" label="Example" onChange={clickWatcher} />);
    const component = wrapper.find('[data-test="component-checkbox-toggle"]');
    component.simulate('keyDown', { code: 'Space', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(clickWatcher).toHaveBeenCalledTimes(1);
  });

  it('ignores other keypresses', () => {
    const wrapper = shallow(<Checkbox id="test" label="Example" onChange={clickWatcher} />);
    const component = wrapper.find('[data-test="component-checkbox-toggle"]');
    component.simulate('keyDown', { code: 'Tab', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalledTimes(0);
    expect(clickWatcher).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
