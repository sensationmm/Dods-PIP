import { shallow, mount } from 'enzyme';
import React from 'react';

import DatePicker from '.';

describe('DatePicker', () => {
  let wrapper,
    count = 0;

  const mockOnChange = jest.fn();

  const states = [
    { isOpen: false }, // calls onBlur if given
    { isOpen: false }, // renders without error
    { isOpen: false }, // opens popup
    { isOpen: true }, // sets date
    { isOpen: true }, // closes popup
    { isOpen: false }, // renders custom placeholder
    { isOpen: true }, // renders given value
    { isOpen: true }, // uses minDate
    { isOpen: true }, // uses maxDate
    { isOpen: false }, // prevents manually editing date
  ];

  describe('mounted', () => {
    it('calls onBlur if given', () => {
      const mockOnBlur = jest.fn();
      wrapper = mount(
        <DatePicker id="example" onChange={mockOnChange} value="" onBlur={mockOnBlur} />,
      );
      const input = wrapper.find('input');
      input.simulate('focus');
      const picker = wrapper.find('.react-datepicker__day');
      picker.at(10).simulate('click');
      expect(mockOnBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('shallow', () => {
    let useStateSpy, mockSetState;

    beforeAll(() => {
      useStateSpy = jest.spyOn(React, 'useState');
      mockSetState = jest.fn();
      useStateSpy.mockImplementation(() => [states[count].isOpen, mockSetState]);
    });

    beforeEach(() => {
      wrapper = shallow(<DatePicker id="example" onChange={mockOnChange} value="" />);
    });

    it('renders without error', () => {
      const component = wrapper.find('[data-test="component-date-picker"]');
      expect(component.length).toEqual(1);
    });

    it('opens popup', () => {
      const trigger = wrapper.find('[data-test="date-picker-input"]');
      trigger.simulate('focus');
      expect(mockSetState).toHaveBeenCalledWith(true);
    });

    it('sets date', () => {
      const picker = wrapper.find('[data-test="date-popup"]');
      picker.props().onChange(new Date('01-02-2022'));
      expect(mockSetState).toHaveBeenCalledWith(false);
      expect(mockOnChange).toHaveBeenCalledWith('2022-01-02');
    });

    it('closes popup', () => {
      const picker = wrapper.find('[data-test="date-popup"]');
      picker.props().onClickOutside();
      expect(mockSetState).toHaveBeenCalledWith(false);
    });

    it('renders custom placeholder', () => {
      wrapper = shallow(
        <DatePicker id="example" onChange={mockOnChange} value="" placeholder="Example label" />,
      );
      const input = wrapper.find('[data-test="date-picker-input"]');
      expect(input.props().value).toEqual('Example label');
    });

    it('renders given value', () => {
      wrapper = shallow(
        <DatePicker
          id="example"
          onChange={mockOnChange}
          value="2022-01-01"
          placeholder="Example label"
        />,
      );
      const picker = wrapper.find('[data-test="date-popup"]');
      const input = wrapper.find('[data-test="date-picker-input"]');
      expect(input.props().value).toEqual('01/01/2022');
      expect(picker.props().selected).toEqual(new Date('01/01/2022'));
    });

    it('uses minDate', () => {
      wrapper = shallow(
        <DatePicker
          id="example"
          onChange={mockOnChange}
          value=""
          minDate="2022-01-01"
          placeholder="Example label"
        />,
      );
      const picker = wrapper.find('[data-test="date-popup"]');
      expect(picker.props().minDate).toEqual(new Date('01/01/2022'));
    });

    it('uses maxDate', () => {
      wrapper = shallow(
        <DatePicker
          id="example"
          onChange={mockOnChange}
          value=""
          maxDate="2022-06-01"
          placeholder="Example label"
        />,
      );
      const picker = wrapper.find('[data-test="date-popup"]');
      expect(picker.props().maxDate).toEqual(new Date('06/01/2022'));
    });

    it('prevents manually editing date', () => {
      const input = wrapper.find('[data-test="date-picker-input"]');
      input.props().onChange('2022-01-01');
      expect(mockOnChange).toHaveBeenCalledTimes(0);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
