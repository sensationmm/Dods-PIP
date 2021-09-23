import { shallow } from 'enzyme';
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import SelectMulti from '.';
import color from '../../../globals/color';
import { Icons } from '../../Icon/assets';
import Text from '../../Text';

describe('SelectMulti', () => {
  let wrapper;

  const defaultState = {
    isOpen: false,
  };

  const states = [
    defaultState, // renders without error
    defaultState, // renders default label
    defaultState, // renders custom placeholder
    defaultState, // handles empty helper text
    defaultState, // sets value on choosing initial option
    defaultState, // sets value on choosing additional option
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

  const useStateSpy = jest.spyOn(React, 'useState');
  const mockSetOpen = jest.fn();
  useStateSpy.mockImplementation(() => [states[count].isOpen, mockSetOpen]);
  const mockOnChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <SelectMulti
        id="example"
        value={[]}
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
      <SelectMulti
        id="example"
        value={[]}
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
      <SelectMulti
        id="example"
        value={[]}
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

  it('sets value on choosing initial option', () => {
    const trigger = wrapper.find('[data-test="select-trigger"]');
    const option = wrapper.find('[data-test="option-1"]');

    trigger.simulate('click');
    expect(mockSetOpen).toHaveBeenCalledWith(true);

    option.simulate('click');
    expect(mockOnChange).toHaveBeenCalledWith(['option2']);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('sets value on choosing additional option', () => {
    wrapper = shallow(
      <SelectMulti
        id="example"
        value={['option3']}
        onChange={mockOnChange}
        options={[
          { name: 'Option 1', value: 'option1' },
          { name: 'Option 2', value: 'option2' },
          { name: 'Option 3', value: 'option3' },
        ]}
      />,
    );
    const trigger = wrapper.find('[data-test="select-trigger"]');
    const option = wrapper.find('[data-test="option-1"]');

    trigger.simulate('click');
    expect(mockSetOpen).toHaveBeenCalledWith(true);

    option.simulate('click');
    expect(mockOnChange).toHaveBeenCalledWith(['option3', 'option2']);
    expect(mockSetOpen).toHaveBeenCalledWith(false);
  });

  it('shows correct label for passed prop value', () => {
    wrapper = shallow(
      <SelectMulti
        id="example"
        value={['option3']}
        onChange={mockOnChange}
        options={[
          { name: 'Option 1', value: 'option1' },
          { name: 'Option 2', value: 'option2' },
          { name: 'Option 3', value: 'option3' },
        ]}
      />,
    );

    const input = wrapper.find('[data-test="select-input"]');
    const count = wrapper.find('[data-test="selected-count"]');
    expect(input.props().value).toEqual('Items selected');
    expect(count.length).toEqual(1);
    expect(count.find(Text).props().children).toEqual(1);
  });

  it('handles passed prop value not matching options', () => {
    wrapper = shallow(
      <SelectMulti
        id="example"
        value={['option']}
        onChange={mockOnChange}
        options={[
          { name: 'Option 1', value: 'option1' },
          { name: 'Option 2', value: 'option2' },
          { name: 'Option 3', value: 'option3' },
        ]}
      />,
    );

    const input = wrapper.find('[data-test="select-input"]');
    expect(input.props().value).toEqual('Choose an option...');
  });

  it('shows correct open state', () => {
    const input = wrapper.find('[data-test="select-input"]');
    expect(input.props().icon).toEqual(Icons.IconChevronUp);
  });

  it('renders disabled state', () => {
    wrapper = shallow(
      <SelectMulti
        id="example"
        value={[]}
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
      <SelectMulti
        id="example"
        value={['option1']}
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

    const icon = wrapper.find('[data-test="component-checkbox-toggle"]');
    expect(icon.at(0).props().hasError).toEqual(true);
  });

  it('keyboard use - triggers dropdown on focus', () => {
    const input = wrapper.find('[data-test="select-input"]');
    input.simulate('focus');
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it('keyboard use - selects option on keypress', () => {
    const option = wrapper.find('[data-test="option-1"]');
    option.simulate('keypress');
    expect(mockOnChange).toHaveBeenCalledWith(['option2']);
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

  afterEach(() => {
    count++;
    jest.clearAllMocks();
  });
});
