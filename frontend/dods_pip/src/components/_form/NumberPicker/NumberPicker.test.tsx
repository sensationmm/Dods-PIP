import { shallow } from 'enzyme';
import React from 'react';

import color from '../../../globals/color';
import Icon from '../../Icon';
import Text from '../../Text';
import NumberPicker from '.';

describe('NumberPicker', () => {
  describe('functionality', () => {
    it('renders without error', () => {
      const wrapper = shallow(<NumberPicker label="Example" value="Example" onChange={jest.fn} />);
      const component = wrapper.find('[data-test="number-input-component"]');
      expect(component.length).toEqual(1);
    });

    it('should return 4', () => {
      const typeWatcher = jest.fn();
      const wrapper = shallow(<NumberPicker value="" onChange={typeWatcher} />);
      const input = wrapper.find('[data-test="component-input-number"]');
      input.simulate('focus');
      input.simulate('change', { target: { value: '4' } });

      expect(typeWatcher).toHaveBeenCalledTimes(1);
      expect(typeWatcher).toHaveBeenCalledWith('4');
    });

    it('should return 5', () => {
      const typeWatcher = jest.fn();
      const wrapper = shallow(<NumberPicker value="4" onChange={typeWatcher} />);
      const plusButton = wrapper.find('[data-test="plus-button"]');
      plusButton.simulate('click');

      expect(typeWatcher).toHaveBeenCalledTimes(1);
      expect(typeWatcher).toHaveBeenCalledWith('5');
    });

    it('increment should fail if number outside of maximum bound', () => {
      const typeWatcher = jest.fn();
      const wrapper = shallow(<NumberPicker value="5" maxVal={'5'} onChange={typeWatcher} />);
      const plusButton = wrapper.find('[data-test="plus-button"]');
      plusButton.simulate('click');

      expect(typeWatcher).toHaveBeenCalledTimes(0);
    });

    it('decrement should fail if number outside of minimum bound', () => {
      const typeWatcher = jest.fn();
      const wrapper = shallow(<NumberPicker value="5" minVal={'5'} onChange={typeWatcher} />);
      const minusButton = wrapper.find('[data-test="minus-button"]');
      minusButton.simulate('click');

      expect(typeWatcher).toHaveBeenCalledTimes(0);
    });

    it('should return 3', () => {
      const typeWatcher = jest.fn();
      const wrapper = shallow(<NumberPicker value="4" onChange={typeWatcher} />);
      const plusButton = wrapper.find('[data-test="minus-button"]');
      plusButton.simulate('click');

      expect(typeWatcher).toHaveBeenCalledTimes(1);
      expect(typeWatcher).toHaveBeenCalledWith('3');
    });
  });

  describe('on blur tests', () => {
    it('should warn that the number is out of the limits!', () => {
      const onBlur = jest.fn();
      const minVal = '5';
      const maxVal = '10';
      const outOfVbondrVal = '20';

      const wrapper = shallow(
        <NumberPicker
          onChange={jest.fn}
          value="5"
          minVal={minVal}
          maxVal={maxVal}
          onBlur={onBlur}
        />,
      );
      const component = wrapper.find('[data-test="component-input-number"]');

      component.simulate('blur', { target: { value: outOfVbondrVal } });
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(`Must be in range ${minVal}-${maxVal}`);
    });

    it('should show minimum value warning', () => {
      const onBlur = jest.fn();
      const minVal = '5';
      const outOfVbondrVal = '3';

      const wrapper = shallow(
        <NumberPicker onChange={jest.fn} value="5" minVal={minVal} onBlur={onBlur} />,
      );
      const component = wrapper.find('[data-test="component-input-number"]');

      component.simulate('blur', { target: { value: outOfVbondrVal } });
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(`Minimum value is ${minVal}`);
    });

    it('should show maximum value warning', () => {
      const onBlur = jest.fn();
      const maxVal = '10';
      const outOfVbondrVal = '20';

      const wrapper = shallow(
        <NumberPicker onChange={jest.fn} value="5" maxVal={maxVal} onBlur={onBlur} />,
      );
      const component = wrapper.find('[data-test="component-input-number"]');

      component.simulate('blur', { target: { value: outOfVbondrVal } });
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(`Maximum value is ${maxVal}`);
    });

    it("shouldn't warn that the number is out of the limits!", () => {
      const onBlur = jest.fn();
      const minVal = '5';
      const maxVal = '10';
      const notOutOfVbondrVal = '7';

      const wrapper = shallow(
        <NumberPicker
          onChange={jest.fn}
          value="5"
          minVal={minVal}
          maxVal={maxVal}
          onBlur={onBlur}
        />,
      );
      const component = wrapper.find('[data-test="component-input-number"]');

      component.simulate('blur', { target: { value: notOutOfVbondrVal } });
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith(undefined);
    });

    it("shouldn't return a valid value, as the input of the function doesn't have a correct number format", () => {
      const onBlur = jest.fn();
      const minVal = '5';
      const maxVal = '10';
      const notOutOfVbondrVal = 'A';

      const wrapper = shallow(
        <NumberPicker
          onChange={jest.fn}
          value="5"
          minVal={minVal}
          maxVal={maxVal}
          onBlur={onBlur}
        />,
      );
      const component = wrapper.find('[data-test="component-input-number"]');

      component.simulate('blur', { target: { value: notOutOfVbondrVal } });
      expect(onBlur).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledWith('This field is required');
    });
  });

  describe('styles', () => {
    it('should show the minus button in grey due to the disabled state', () => {
      const typewatcher = jest.fn();
      const wrapper = shallow(
        <NumberPicker label="Example" onChange={typewatcher} value="5" isDisabled />,
      );
      const minusButton = wrapper.find('[data-test="minus-icon"]');
      expect(minusButton.find(Icon).props().color).toEqual(color.base.greyDark);
    });
    it('should show the minus button in red due to the error state', () => {
      const typewatcher = jest.fn();
      const wrapper = shallow(
        <NumberPicker label="Example" onChange={typewatcher} value="5" error="example" />,
      );
      const minusButton = wrapper.find('[data-test="minus-icon"]');
      expect(minusButton.find(Icon).props().color).toEqual(color.base.white);
    });

    it('should show the helper text in grey due to the disabled state', () => {
      const typewatcher = jest.fn();
      const wrapper = shallow(
        <NumberPicker
          label="Example"
          onChange={typewatcher}
          value="5"
          helperText="example"
          isDisabled
        />,
      );
      const minusButton = wrapper.find('[data-test="component-input-base-helper"]');
      expect(minusButton.find(Text).props().color).toEqual(color.base.grey);
    });
    it('should show the helper text in red due to the error state', () => {
      const typewatcher = jest.fn();
      const wrapper = shallow(
        <NumberPicker label="Example" onChange={typewatcher} value="5" error="example" />,
      );
      const minusButton = wrapper.find('[data-test="component-input-base-helper"]');
      expect(minusButton.find(Text).props().color).toEqual(color.alert.red);
    });

    it('should show the helper text in red due to the error state', () => {
      const typewatcher = jest.fn();
      const wrapper = shallow(
        <NumberPicker label="Example" onChange={typewatcher} value="5" helperText="example" />,
      );
      const minusButton = wrapper.find('[data-test="component-input-base-helper"]');
      expect(minusButton.find(Text).props().color).toEqual(color.theme.blueMid);
    });
  });

  describe('Hover styles', () => {
    let wrapper,
      count = 0,
      setState,
      onChange,
      useStateSpy;

    const states = [{ hoverMinusButton: true }, { hoverMinusButton: false }];

    beforeEach(() => {
      setState = jest.fn();
      onChange = jest.fn();
      useStateSpy = jest.spyOn(React, 'useState');
      useStateSpy
        .mockImplementationOnce(() => [states[count].hoverMinusButton, setState])
        .mockImplementationOnce(() => [states[count].hoverMinusButton, setState]);

      wrapper = shallow(<NumberPicker value="4" onChange={onChange} />);
    });

    it('should show the minus button in blue due to the hover state', () => {
      const minusButton = wrapper.find('[data-test="minus-icon"]');
      expect(minusButton.find(Icon).props().color).toEqual(color.theme.blue);
    });

    it('should show the minus button in grey due to the lack of activity with it', () => {
      const minusButton = wrapper.find('[data-test="minus-icon"]');
      expect(minusButton.find(Icon).props().color).toEqual(color.base.grey);
    });

    afterEach(() => {
      jest.resetAllMocks();
      count++;
    });
  });

  describe('hover and click events ', () => {
    let wrapper,
      count = 0,
      setState,
      onChange,
      useStateSpy;
    const defaultState = { hoverPlusButton: false, hoverMinusButton: false };

    const states = [
      defaultState, // should return true on mouse enter on minus button
      defaultState, // should return false on mouse leave on minus button
      defaultState,
      defaultState,
      defaultState,
      { hoverPlusButton: false, hoverMinusButton: true },
    ];

    beforeEach(() => {
      setState = jest.fn();
      onChange = jest.fn();
      useStateSpy = jest.spyOn(React, 'useState');
      useStateSpy
        .mockImplementationOnce(() => [states[count].hoverMinusButton, setState])
        .mockImplementationOnce(() => [states[count].hoverPlusButton, setState]);
      wrapper = shallow(<NumberPicker value="4" onChange={onChange} />);
    });

    it('should return true on mouse enter on minus button', () => {
      const component = wrapper.find('[data-test="minus-button"]');
      component.simulate('mouseenter');
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith(true);
    });

    it('should return false on mouse leave on minus button', () => {
      const component = wrapper.find('[data-test="minus-button"]');
      component.simulate('mouseleave');
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith(false);
    });

    it('should return true on mouse enter on plus button', () => {
      const component = wrapper.find('[data-test="plus-button"]');
      component.simulate('mouseenter');
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith(true);
    });

    it('should return false on mouse leave on plus button', () => {
      const component = wrapper.find('[data-test="plus-button"]');
      component.simulate('mouseleave');
      expect(setState).toHaveBeenCalledTimes(1);
      expect(setState).toHaveBeenCalledWith(false);
    });

    afterEach(() => {
      jest.resetAllMocks();
      count++;
    });
  });

  describe('error handling', () => {
    const mockOnBlur = jest.fn();
    const mockSetState = jest.fn();
    let useStateSpy;

    beforeEach(() => {
      const defaultState = { hoverPlusButton: false, hoverMinusButton: false };

      useStateSpy = jest.spyOn(React, 'useState');
      useStateSpy
        .mockImplementationOnce(() => [defaultState.hoverMinusButton, mockSetState])
        .mockImplementationOnce(() => [defaultState.hoverPlusButton, mockSetState]);
    });

    it('clears min value error on clicking plus if now within bounds', () => {
      const wrapper = shallow(
        <NumberPicker
          label="Example"
          value="4"
          minVal="5"
          onChange={jest.fn}
          error="error"
          onBlur={mockOnBlur}
        />,
      );
      const incrementer = wrapper.find('[data-test="plus-button"]');
      incrementer.simulate('click');
      expect(mockOnBlur).toHaveBeenCalledWith(undefined);
    });

    it('maintains min value error on clicking plus if still outside of bounds', () => {
      const wrapper = shallow(
        <NumberPicker
          label="Example"
          value="3"
          minVal="5"
          onChange={jest.fn}
          error="error"
          onBlur={mockOnBlur}
        />,
      );
      const incrementer = wrapper.find('[data-test="plus-button"]');
      incrementer.simulate('click');
      expect(mockOnBlur).toHaveBeenCalledTimes(0);
    });

    it('clears max value error on clicking minus if now within bounds', () => {
      const wrapper = shallow(
        <NumberPicker
          label="Example"
          value="6"
          maxVal="5"
          onChange={jest.fn}
          error="error"
          onBlur={mockOnBlur}
        />,
      );
      const decrementer = wrapper.find('[data-test="minus-button"]');
      decrementer.simulate('click');
      expect(mockOnBlur).toHaveBeenCalledWith(undefined);
    });

    it('maintains max value error on clicking minus if still outside of bounds', () => {
      const wrapper = shallow(
        <NumberPicker
          label="Example"
          value="7"
          maxVal="5"
          onChange={jest.fn}
          error="error"
          onBlur={mockOnBlur}
        />,
      );
      const decrementer = wrapper.find('[data-test="minus-button"]');
      decrementer.simulate('click');
      expect(mockOnBlur).toHaveBeenCalledTimes(0);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
