import { shallow } from 'enzyme';
import React from 'react';
import color from '../../../globals/color';

import Dropdown from './Dropdown';

describe('Dropdown', () => {
  let wrapper;

  const mockOnChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <Dropdown
        isOpen={false}
        hasHelper={false}
        hasError={false}
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        setValue={mockOnChange}
      />,
    );
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-dropdown"]');
    expect(component.length).toEqual(1);
  });

  it('shows single selected option', () => {
    wrapper = shallow(
      <Dropdown
        isOpen={false}
        hasHelper={false}
        hasError={false}
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        setValue={mockOnChange}
        selectedValue="option2"
      />,
    );
    const icon = wrapper.find('[data-test="selected-icon"]');
    expect(icon.length).toEqual(1);
  });

  it('shows multiple selected option2', () => {
    wrapper = shallow(
      <Dropdown
        isOpen={false}
        hasHelper={false}
        hasError={false}
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        setValue={mockOnChange}
        selectedValue={['option2', 'option3']}
      />,
    );
    const icon = wrapper.find('[data-test="selected-icon"]');
    expect(icon.length).toEqual(2);
  });

  it('renders error state', () => {
    wrapper = shallow(
      <Dropdown
        isOpen={false}
        hasHelper={false}
        hasError={true}
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        setValue={mockOnChange}
        selectedValue="option2"
      />,
    );
    const icon = wrapper.find('[data-test="selected-icon"]');
    expect(icon.props().color).toEqual(color.alert.red);
  });

  it('selects option on click', () => {
    const option = wrapper.find('[data-test="option-1"]');
    option.simulate('click');
    expect(mockOnChange).toHaveBeenCalledWith('option2', { label: 'Option 2', value: 'option2' });
  });

  it('keyboard use - selects option on keypress', () => {
    const option = wrapper.find('[data-test="option-1"]');
    option.simulate('keypress');
    expect(mockOnChange).toHaveBeenCalledWith('option2', { label: 'Option 2', value: 'option2' });
  });

  it('click disabled if active', () => {
    wrapper = shallow(
      <Dropdown
        isOpen={false}
        hasHelper={false}
        hasError={false}
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        setValue={mockOnChange}
        selectedValue="option2"
      />,
    );
    const option = wrapper.find('[data-test="option-1"]');
    option.simulate('click');
    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
