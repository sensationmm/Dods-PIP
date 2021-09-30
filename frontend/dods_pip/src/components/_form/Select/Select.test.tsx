import { mount, shallow } from 'enzyme';
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import Select from '.';
import { dropdownItem } from './Select.styles';
import color from '../../../globals/color';
import { Icons } from '../../Icon/assets';

describe('Select', () => {
  let wrapper;

  const mockOnChange = jest.fn();

  const defaultState = {
    isOpen: false,
  };

  const states = [
    defaultState, // calls onBlur if given
    defaultState, // renders without error
    defaultState, // renders default label
    defaultState, // renders custom placeholder
    defaultState, // handles empty helper text
    defaultState, // sets value on choosing option
    defaultState, // shows correct label for passed prop value
    defaultState, // handles passed prop value not matching options
    { ...defaultState, isOpen: true }, // shows correct open state
    defaultState, // renders disabled state
    defaultState, // renders error state
    defaultState, // keyboard use - triggers dropdown on focus
    { ...defaultState, isOpen: true }, // keyboard use - selects option on keypress
    defaultState, // keyboard use - prevents typing in input
    defaultState, // click outside
  ];

  let count = 0;

  describe('mounted', () => {
    it('calls onBlur if given', () => {
      const mockOnBlur = jest.fn();
      const mountedWrapper = mount(
        <Select
          id="example"
          onChange={mockOnChange}
          value=""
          onBlur={mockOnBlur}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
        />,
      );
      const input = mountedWrapper.find('input');
      input.simulate('focus');
      const option = mountedWrapper.find(dropdownItem).at(2);
      option.simulate('click');
      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('shallow', () => {
    let useStateSpy, mockSetOpen;
    beforeAll(() => {
      useStateSpy = jest.spyOn(React, 'useState');
      mockSetOpen = jest.fn();
      useStateSpy.mockImplementation(() => [states[count].isOpen, mockSetOpen]);
    });

    beforeEach(() => {
      wrapper = shallow(
        <Select
          id="example"
          value=""
          onChange={mockOnChange}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
        />,
      );
    });

    it('renders without error', () => {
      const component = wrapper.find('[data-test="component-select"]');
      expect(component.length).toEqual(1);
    });

    it('renders default label', () => {
      const input = wrapper.find('[data-test="select-input"]');
      const icon = wrapper.find('[data-test="selected-icon"]');
      expect(icon.length).toEqual(0);
      expect(input.props().value).toEqual('Choose an option...');
      expect(input.props().icon).toEqual(Icons.IconChevronDown);
    });

    it('renders custom placeholder', () => {
      wrapper = shallow(
        <Select
          id="example"
          value=""
          onChange={mockOnChange}
          placeholder={'Custom value'}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
        />,
      );
      const input = wrapper.find('[data-test="select-input"]');
      expect(input.props().value).toEqual('Custom value');
    });

    it('handles empty helper text', () => {
      wrapper = shallow(
        <Select
          id="example"
          value=""
          onChange={mockOnChange}
          placeholder={'Custom value'}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
          helperText={''}
        />,
      );
      const dropdown = wrapper.find('[data-test="select-dropdown"]');
      expect(dropdown.props().hasHelper).toEqual(false);
    });

    it('sets value on choosing option', () => {
      const trigger = wrapper.find('[data-test="select-trigger"]');
      const option = wrapper.find('[data-test="option-1"]');

      trigger.simulate('click');
      expect(mockSetOpen).toHaveBeenCalledWith(true);

      option.simulate('click');
      expect(mockOnChange).toHaveBeenCalledWith('option2');
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });

    it('shows correct label for passed prop value', () => {
      wrapper = shallow(
        <Select
          id="example"
          value="option3"
          onChange={mockOnChange}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
        />,
      );

      const input = wrapper.find('[data-test="select-input"]');
      const icon = wrapper.find('[data-test="selected-icon"]');
      expect(input.props().value).toEqual('Option 3');
      expect(icon.length).toEqual(1);
    });

    it('handles passed prop value not matching options', () => {
      wrapper = shallow(
        <Select
          id="example"
          value="option"
          onChange={mockOnChange}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
        />,
      );

      const input = wrapper.find('[data-test="select-input"]');
      expect(input.props().value).toEqual('');
    });

    it('shows correct open state', () => {
      const input = wrapper.find('[data-test="select-input"]');
      expect(input.props().icon).toEqual(Icons.IconChevronUp);
    });

    it('renders disabled state', () => {
      wrapper = shallow(
        <Select
          id="example"
          value=""
          onChange={mockOnChange}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
          isDisabled={true}
        />,
      );

      const trigger = wrapper.find('[data-test="select-trigger"]');
      expect(trigger.length).toEqual(0);
    });

    it('renders error state', () => {
      wrapper = shallow(
        <Select
          id="example"
          value="option1"
          onChange={mockOnChange}
          placeholder={'Custom value'}
          options={[
            { name: 'Option 1', value: 'option1' },
            { name: 'Option 2', value: 'option2' },
            { name: 'Option 3', value: 'option3' },
          ]}
          error="Required"
        />,
      );

      const icon = wrapper.find('[data-test="selected-icon"]');
      expect(icon.props().color).toEqual(color.alert.red);
    });

    it('keyboard use - triggers dropdown on focus', () => {
      const input = wrapper.find('[data-test="select-input"]');
      input.simulate('focus');
      expect(mockSetOpen).toHaveBeenCalledWith(true);
    });

    it('keyboard use - selects option on keypress', () => {
      const option = wrapper.find('[data-test="option-1"]');
      option.simulate('keypress');
      expect(mockOnChange).toHaveBeenCalledWith('option2');
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });

    it('keyboard use - prevents typing in input', () => {
      const input = wrapper.find('[data-test="select-input"]');
      input.simulate('change');
      expect(mockSetOpen).toHaveBeenCalledWith(true);
    });

    it('click outside', () => {
      const clickOutside = wrapper.find(OutsideClickHandler);
      clickOutside.props().onOutsideClick();
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });

  afterEach(() => {
    count++;
    jest.clearAllMocks();
  });
});
