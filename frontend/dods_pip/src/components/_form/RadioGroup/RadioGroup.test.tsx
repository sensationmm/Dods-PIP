import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import RadioGroup, { IRadioGroupProps } from '.';
import { radioTheme } from '../Radio';

const ON_CHANGE_FN = jest.fn();

const SELECTOR_COMPONENT = '[data-test="component-radio-group"]';
const SELECTOR_LABEL = '[data-test="radio-group-label"]';
const SELECTOR_RADIO_ITEMS = '[data-test="radio-group-items"]';

const getWrapper = (props: IRadioGroupProps = DEFAULT_PROPS) => shallow(<RadioGroup {...props} />);
const getRadioItems = (wrapperInstance: ShallowWrapper) =>
  wrapperInstance.find(SELECTOR_RADIO_ITEMS).children().getElements();

const DEFAULT_PROPS = {
  items: [1, 2, 3].map((item) => ({ label: `Test ${item}`, value: `test${item}` })),
  onChange: ON_CHANGE_FN,
};

describe('RadioGroup', () => {
  it('renders default state', () => {
    const component = getWrapper().find(SELECTOR_COMPONENT);
    const radioItems = getRadioItems(component);
    expect(component.length).toEqual(1);
    expect(radioItems).toHaveLength(DEFAULT_PROPS.items.length);
    expect(
      radioItems.every((radio) => {
        const props = radio.props;
        return (
          props.isDisabled === false && props.isChecked === false && /group_\d{13}/.test(props.name)
        );
      }),
    ).toBe(true);
  });

  describe.each([['dark'], ['light']])('when theme is set to %s', (value) => {
    it(`should set all radio themes to ${value}`, () => {
      const radioItems = getRadioItems(
        getWrapper({ ...DEFAULT_PROPS, theme: value as radioTheme }),
      );
      expect(radioItems.every((radio) => radio.props.theme === value)).toBe(true);
    });
  });

  describe('when a label is set', () => {
    it('should render a label', () => {
      const label = getWrapper({ ...DEFAULT_PROPS, label: 'test' }).find(SELECTOR_LABEL);
      expect(label).toHaveLength(1);
      expect(label.props()['label']).toBe('test');
      expect(label.props()['required']).toBe(false);
      expect(label.props()['optional']).toBe(false);
    });

    describe.each([
      ['required', true, true],
      ['optional', true, true],
    ])('and %s is true', (prop, value, expected) => {
      it(`should set label to ${prop}`, () => {
        const label = getWrapper({ ...DEFAULT_PROPS, label: 'test', [prop]: true }).find(
          SELECTOR_LABEL,
        );
        expect(label.props()[prop]).toBe(expected);
      });
    });

    describe.each([
      ['light', 'theme', true],
      ['dark', 'theme', false],
    ])('and theme is `%s`', (value, prop, expected) => {
      it('should set label darkMode', () => {
        const label = getWrapper({
          ...DEFAULT_PROPS,
          label: 'test',
          theme: value as radioTheme,
        }).find(SELECTOR_LABEL);

        expect(label.props()['darkMode']).toBe(expected);
      });
    });
  });

  describe('when group name is NOT set', () => {
    it('should set a random name for all radios', () => {
      const radioItems = getRadioItems(getWrapper());
      expect(radioItems.every((radio) => /^group_\d{13}$/.test(radio.props.name))).toBe(true);
    });
  });

  it('should set name for all radios', () => {
    const radioItems = getRadioItems(getWrapper({ ...DEFAULT_PROPS, groupName: 'testing' }));
    expect(radioItems.every((radio) => radio.props.name === 'testing')).toBe(true);
  });

  describe('when radio selection is made', () => {
    let radioItems, wrapper;
    beforeEach(() => {
      wrapper = getWrapper();
      radioItems = getRadioItems(wrapper);
    });

    it('should call on change fn', () => {
      radioItems.forEach((radioItem, index) => {
        const value = radioItem.props.value;
        wrapper.find(`[value="${value}"]`).props().onChange(value);
        expect(ON_CHANGE_FN).toHaveBeenCalledWith(value);
        expect(ON_CHANGE_FN).toHaveBeenCalledTimes(index + 1);
      });
    });
  });

  describe('when disabled is true', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, isDisabled: true });
    });

    it('should set all radio items to disabled', () => {
      const radioItems = getRadioItems(wrapper);

      expect(radioItems.every((item) => item.props.isDisabled === true)).toBe(true);
    });
  });

  describe('when a selected value is set', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = getWrapper({ ...DEFAULT_PROPS, selectedValue: DEFAULT_PROPS.items[1].value });
    });

    it('should set the matching radio to checked', () => {
      const radioItems = getRadioItems(wrapper);

      expect(radioItems.filter((item) => item.props.isChecked)).toHaveLength(1);
    });
  });
});
