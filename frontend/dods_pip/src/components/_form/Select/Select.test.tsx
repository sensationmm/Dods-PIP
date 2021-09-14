import { shallow } from 'enzyme';
import React from 'react';

import Select from '.';
import { Icons } from '../../Icon/assets';

describe('Select', () => {
  let wrapper;

  const defaultState = {
    isOpen: false,
  };

  const states = [
    defaultState, // renders without error
    defaultState, // renders default label
    defaultState, // renders custom placeholder
    defaultState, // sets value on choosing option
    defaultState, // shows correct label for passed prop value
    defaultState, // handles passed prop value not matching options
    { ...defaultState, isOpen: true }, // shows correct open state
    defaultState, // renders disabled state
    defaultState, // keyboard use - triggers dropdown on focus
    { ...defaultState, isOpen: true }, // keyboard use - selects option on keypress
    defaultState, // keyboard use - prevents typing in input
  ];

  let count = 0;

  const useStateSpy = jest.spyOn(React, 'useState');
  const mockSetState = jest.fn();
  useStateSpy.mockImplementation(() => [states[count].isOpen, mockSetState]);
  const mockOnChange = jest.fn();

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

  it('sets value on choosing option', () => {
    const trigger = wrapper.find('[data-test="select-trigger"]');
    const option = wrapper.find('[data-test="option-1"]');

    trigger.simulate('click');
    expect(mockSetState).toHaveBeenCalledWith(true);

    option.simulate('click');
    expect(mockOnChange).toHaveBeenCalledWith('option2');
    expect(mockSetState).toHaveBeenCalledWith(false);
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
    expect(input.props().value).toEqual('Option 3');
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

  it('keyboard use - triggers dropdown on focus', () => {
    const input = wrapper.find('[data-test="select-input"]');
    input.simulate('focus');
    expect(mockSetState).toHaveBeenCalledWith(true);
  });

  it('keyboard use - selects option on keypress', () => {
    const option = wrapper.find('[data-test="option-1"]');
    option.simulate('keypress');
    expect(mockOnChange).toHaveBeenCalledWith('option2');
    expect(mockSetState).toHaveBeenCalledWith(false);
  });

  it('keyboard use - prevents typing in input', () => {
    const input = wrapper.find('[data-test="select-input"]');
    input.simulate('change');
    expect(mockSetState).toHaveBeenCalledWith(true);
  });

  afterEach(() => {
    count++;
    jest.clearAllMocks();
  });
});
