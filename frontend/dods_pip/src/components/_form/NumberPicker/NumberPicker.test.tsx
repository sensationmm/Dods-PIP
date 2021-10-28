import React from 'react';
import { shallow } from 'enzyme';

import NumberPicker, { NumberPickerProps } from '.';

const ERROR_MSG_PROP = 'test error';
const HELPER_MSG_PROP = 'test helper';

const SELECTOR_CONTAINER = '[data-test="number-picker-container"]';
const SELECTOR_MINUS = '[data-test="number-picker-minus"]';
const SELECTOR_INPUT = '[data-test="number-picker-input"]';
const SELECTOR_PLUS = '[data-test="number-picker-plus"]';
const SELECTOR_HELPER_TEXT = '[data-test="number-picker-helper-text"]';
const SELECTOR_LABEL = '[data-test="number-picker-label"]';

const MOCK_CHANGE_FN = jest.fn();
const MOCK_BLUR_FN = jest.fn();
const MOCK_SET_STATE = jest.fn();
const DEFAULT_PROPS = {
  onChange: MOCK_CHANGE_FN,
  onBlur: MOCK_BLUR_FN,
};

const getWrapper = (props: NumberPickerProps = DEFAULT_PROPS) =>
  shallow(<NumberPicker {...props} />);

describe('NumberPicker', () => {
  const useStateSpy = jest.spyOn(React, 'useState');

  beforeEach(() => {
    useStateSpy.mockImplementation((init) => [init, MOCK_SET_STATE]);
  });

  describe.each([
    // prettier-ignore
    ['minVal > maxVal', 10, 9, 'NumberPicker component: (min: 10, max: 9) - Min should be less than max'],
    // prettier-ignore
    ['minVal = maxVal', 10, 10, 'NumberPicker component: (min: 10, max: 10) - Min should be less than max'],
    // prettier-ignore
    ['minVal < 0', -1, 9, 'NumberPicker component: (min: -1, max: 9) - Min should be a positive integer'],
    // prettier-ignore
    ['maxVal > 999', 10, 1000, 'NumberPicker component: (min: 10, max: 1000) - Max should less than or equal to 999'],
  ])('when %s', (condition, min, max, errorMsg) => {
    it('should throw type error', () => {
      try {
        getWrapper({ ...DEFAULT_PROPS, minVal: min, maxVal: max });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error).toHaveProperty('message', errorMsg);
      }
    });
  });

  it('should render default composition', () => {
    const wrapper = getWrapper();
    const container = wrapper.find(SELECTOR_CONTAINER);
    const buttonMinus = container.find(SELECTOR_MINUS);
    const buttonPlus = container.find(SELECTOR_PLUS);
    const input = container.find(SELECTOR_INPUT);
    const helperText = wrapper.find(SELECTOR_HELPER_TEXT);
    const label = wrapper.find(SELECTOR_LABEL);

    expect(wrapper.children()).toHaveLength(2);
    expect(container.children()).toHaveLength(3);
    expect(buttonMinus).toHaveLength(1);
    expect(buttonPlus).toHaveLength(1);
    expect(input).toHaveLength(1);
    expect(helperText).toHaveLength(1);
    expect(label).toHaveLength(0);
  });

  it('should set default styling', () => {
    const container = getWrapper().find(SELECTOR_CONTAINER);

    expect(container.props()).toHaveProperty('isDisabled', false);
    expect(container.props()).toHaveProperty('hasError', false);
    expect(container.props()).toHaveProperty('size', 'medium');
  });

  it('should conditionally render a label', () => {
    let wrapper = getWrapper();
    let label = wrapper.find(SELECTOR_LABEL);

    expect(label).toHaveLength(0);

    wrapper = getWrapper({ ...DEFAULT_PROPS, label: 'test label' });
    label = wrapper.find(SELECTOR_LABEL);

    expect(label).toHaveLength(1);
    expect(label.props().label).toBe('test label');
  });

  it('should not respond to non numeric inputs', () => {
    const wrapper = getWrapper();
    const input = wrapper.find(SELECTOR_INPUT);
    const preventDefault = jest.fn();

    input.simulate('keyPress', { key: 'enzyme', preventDefault });
    input.simulate('keyPress', { key: 'is garbage', preventDefault });

    input.simulate('keyPress', { key: '23', preventDefault });

    expect(preventDefault).toHaveBeenCalledTimes(2);
  });

  describe('when value > minVal && value < maxVal', () => {
    let wrapper, buttonPlus, buttonMinus;
    const TEST_CASE_PROPS = { ...DEFAULT_PROPS, value: 5, minVal: 0, maxVal: 10 };
    beforeEach(() => {
      wrapper = getWrapper(TEST_CASE_PROPS);
      buttonMinus = wrapper.find(SELECTOR_MINUS);
      buttonPlus = wrapper.find(SELECTOR_PLUS);
    });

    it('plus and minus buttons should be active', () => {
      expect(buttonPlus.props().disabled).toBe(false);
      expect(buttonMinus.props().disabled).toBe(false);
    });

    describe('and minus button is clicked', () => {
      beforeEach(() => {
        wrapper = getWrapper(TEST_CASE_PROPS);
        buttonMinus.simulate('click');
      });

      it('should decrement value', () => {
        expect(MOCK_CHANGE_FN).toHaveBeenCalledWith(4);
        expect(MOCK_CHANGE_FN).toHaveBeenCalledTimes(1);
      });
    });

    describe('and plus button is clicked', () => {
      beforeEach(() => {
        wrapper = getWrapper(TEST_CASE_PROPS);
        buttonPlus.simulate('click');
      });

      it('should increment value', () => {
        expect(MOCK_CHANGE_FN).toHaveBeenCalledWith(6);
        expect(MOCK_CHANGE_FN).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when value < minVal', () => {
    let wrapper, buttonMinus, buttonPlus, input;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, value: -5, minVal: 10 });
      buttonMinus = wrapper.find(SELECTOR_MINUS);
      buttonPlus = wrapper.find(SELECTOR_PLUS);
    });

    it('should set the minus button to disabled', () => {
      expect(buttonMinus.props().disabled).toBe(true);
    });

    describe('and plus button is clicked', () => {
      beforeEach(() => {
        buttonPlus.simulate('click');
        wrapper.update();
        input = wrapper.find(SELECTOR_INPUT);
      });

      it('should decrement value starting from minVal value', () => {
        expect(MOCK_CHANGE_FN).toHaveBeenCalledWith(10);
        expect(MOCK_CHANGE_FN).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when value > maxVal', () => {
    let wrapper, buttonPlus, buttonMinus, input;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, value: 50, maxVal: 30 });
      buttonMinus = wrapper.find(SELECTOR_MINUS);
      buttonPlus = wrapper.find(SELECTOR_PLUS);
    });

    it('should set the plus button to disabled', () => {
      expect(buttonPlus.props().disabled).toBe(true);
    });

    describe('and minus button is clicked', () => {
      beforeEach(() => {
        buttonMinus.simulate('click');
        wrapper.update();
        input = wrapper.find(SELECTOR_INPUT);
      });

      it('should decrement value starting from maxVal value', () => {
        expect(MOCK_CHANGE_FN).toHaveBeenCalledWith(29);
        expect(MOCK_CHANGE_FN).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when disabled is true', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, isDisabled: true });
    });

    it('should disable all interactions', () => {
      const buttonMinus = wrapper.find(SELECTOR_MINUS);
      const buttonPlus = wrapper.find(SELECTOR_PLUS);
      const input = wrapper.find(SELECTOR_INPUT);

      expect(buttonMinus.props().disabled).toBe(true);
      expect(buttonPlus.props().disabled).toBe(true);
      expect(input.props().disabled).toBe(true);

      buttonMinus.simulate('click');
      expect(MOCK_CHANGE_FN).not.toHaveBeenCalled();

      buttonPlus.simulate('click');
      expect(MOCK_CHANGE_FN).not.toHaveBeenCalled();
    });

    it('should set disabled styling', () => {
      expect(wrapper.find(SELECTOR_CONTAINER).props()).toHaveProperty('isDisabled', true);
    });
  });

  describe('when there is an error value', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, error: ERROR_MSG_PROP });
    });

    it('should render error message', () => {
      const helperText = wrapper.find(SELECTOR_HELPER_TEXT);
      expect(helperText).toHaveLength(1);
      expect(helperText.html()).toContain(ERROR_MSG_PROP);
      expect(helperText.props()).toHaveProperty('color', '#EB1413');
    });

    it('should set error styling', () => {
      expect(wrapper.find(SELECTOR_CONTAINER).props()).toHaveProperty('hasError', true);
    });
  });

  describe('when there is helper text', () => {
    let wrapper, helperText;

    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, helperText: HELPER_MSG_PROP });
      helperText = wrapper.find(SELECTOR_HELPER_TEXT);
    });

    it('should render helper text', () => {
      expect(helperText).toHaveLength(1);
      expect(helperText.html()).toContain(HELPER_MSG_PROP);
      expect(helperText.props()).toHaveProperty('color', '#124384');
    });

    describe('and component is disabled', () => {
      beforeEach(() => {
        wrapper = getWrapper({ ...DEFAULT_PROPS, helperText: HELPER_MSG_PROP, isDisabled: true });
        helperText = wrapper.find(SELECTOR_HELPER_TEXT);
      });

      it('disabled colour should take precedence', () => {
        expect(helperText.props()).toHaveProperty('color', '#757575');
      });
    });

    describe('and there is an error value', () => {
      beforeEach(() => {
        wrapper = getWrapper({
          ...DEFAULT_PROPS,
          helperText: HELPER_MSG_PROP,
          error: ERROR_MSG_PROP,
        });
        helperText = wrapper.find(SELECTOR_HELPER_TEXT);
      });

      it('error text should take precedence', () => {
        expect(helperText.html()).not.toContain(HELPER_MSG_PROP);
        expect(helperText.html()).toContain(ERROR_MSG_PROP);
      });

      it('error colour should take precedence', () => {
        expect(helperText.props()).toHaveProperty('color', '#EB1413');
      });
    });
  });

  describe('when required is true', () => {
    let wrapper, input;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, required: true });
      input = wrapper.find(SELECTOR_INPUT);
    });
    describe('and value is set to < 0', () => {
      beforeEach(() => {
        input.simulate('change', { target: { value: '-1' } });
        input.simulate('blur');
      });
      it('should set error message', () => {
        expect(MOCK_SET_STATE).toHaveBeenCalledWith('This field is required');
        expect(MOCK_BLUR_FN).toHaveBeenCalled();
        expect(MOCK_CHANGE_FN).not.toHaveBeenCalled();
      });
    });
  });

  describe('when value < minVal', () => {
    let wrapper, input;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, minVal: 10 });
      input = wrapper.find(SELECTOR_INPUT);
    });
    describe('and input value is set to < minVal', () => {
      beforeEach(() => {
        input.simulate('change', { target: { value: '9' } });
        input.simulate('blur');
      });
      it('should set error message', () => {
        expect(MOCK_SET_STATE).toHaveBeenCalledWith('Minimum value is 10');
        expect(MOCK_BLUR_FN).toHaveBeenCalled();
        expect(MOCK_CHANGE_FN).not.toHaveBeenCalled();
      });
    });
  });

  describe('when value > maxVal', () => {
    let wrapper, input;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, maxVal: 10 });
      input = wrapper.find(SELECTOR_INPUT);
    });
    describe('and input value changes', () => {
      beforeEach(() => {
        input.simulate('change', { target: { value: '15' } });
        input.simulate('blur');
      });
      it('should set error message', () => {
        expect(MOCK_SET_STATE).toHaveBeenCalledWith('Maximum value is 10');
        expect(MOCK_BLUR_FN).toHaveBeenCalled();
        expect(MOCK_CHANGE_FN).not.toHaveBeenCalled();
      });
    });
  });

  describe('when input value changes', () => {
    let wrapper, input;

    beforeEach(() => {
      wrapper = getWrapper();
      input = wrapper.find(SELECTOR_INPUT);
      input.simulate('change', { target: { value: '15' } });
      input.simulate('blur');
    });

    it('should emit empty message and value', () => {
      expect(MOCK_SET_STATE).toHaveBeenCalledWith(undefined);
      expect(MOCK_BLUR_FN).toHaveBeenCalled();
      expect(MOCK_CHANGE_FN).toHaveBeenCalledWith(15);
    });
  });

  afterEach(jest.clearAllMocks);
});
