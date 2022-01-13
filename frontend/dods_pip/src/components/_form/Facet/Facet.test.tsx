import { shallow } from 'enzyme';
import React from 'react';

import Facet from '.';
import color from '../../../globals/color';
import Icon from '../../Icon';

const clickWatcher = jest.fn();
const preventDefaultMock = jest.fn();

describe('Facet', () => {
  it('renders without error in the default state', () => {
    const wrapper = shallow(
      <Facet id="test" isChecked={false} label="Example" onChange={jest.fn} />,
    );
    const component = wrapper.find('[data-test="component-checkbox"]');
    expect(component.length).toEqual(1);
  });

  it('renders without error in active state', () => {
    const wrapper = shallow(
      <Facet id="test" label="Example" isChecked={true} onChange={clickWatcher} />,
    );
    const component = wrapper.find('[data-test="component-checkbox"]');
    expect(component.length).toEqual(1);
  });

  it('renders without error in disabled state and is unclickable', () => {
    const wrapper = shallow(
      <Facet
        isChecked={false}
        id="test"
        label="Example"
        isDisabled={true}
        onChange={clickWatcher}
      />,
    );
    const component = wrapper.find('[data-test="component-checkbox"]');
    expect(component.length).toEqual(1);

    const input = wrapper.find('[data-test="component-checkbox-layout"]');
    input.simulate('click');
    expect(clickWatcher).toHaveBeenCalledTimes(0);
  });

  it('registers click', () => {
    const wrapper = shallow(
      <Facet isChecked={false} id="test" label="Example" onChange={clickWatcher} />,
    );
    const component = wrapper.find('[data-test="component-checkbox-layout"]');
    component.simulate('click');
    expect(clickWatcher).toHaveBeenCalledTimes(1);
  });

  it('registers spacebar', () => {
    const wrapper = shallow(
      <Facet isChecked={false} id="test" label="Example" onChange={clickWatcher} />,
    );
    const component = wrapper.find('[data-test="component-checkbox-toggle"]');
    component.simulate('keyDown', { code: 'Space', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(clickWatcher).toHaveBeenCalledTimes(2);
  });

  it('ignores other keypresses', () => {
    const wrapper = shallow(
      <Facet isChecked={false} id="test" label="Example" onChange={clickWatcher} />,
    );
    const component = wrapper.find('[data-test="component-checkbox-toggle"]');
    component.simulate('keyDown', { code: 'Tab', preventDefault: preventDefaultMock });
    expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    expect(clickWatcher).toHaveBeenCalledTimes(2);
  });

  describe("Dark background", () => {

    it("Should display with dark icon in light mode", () => {
      const wrapper = shallow(<Facet onChange={jest.fn} id="1" isChecked={true} darkMode={false} />)
      const component = wrapper.find('[data-test="component-icon"]')
      expect(component.find(Icon).props().color).toEqual(color.base.white)
    })

    it("Should display with light icon in dark mode", () => {
      const wrapper = shallow(<Facet onChange={jest.fn} id="1" isChecked={true} darkMode />)
      const component = wrapper.find('[data-test="component-icon"]')
      expect(component.find(Icon).props().color).toEqual(color.theme.blueDark)
    })

  })
});
