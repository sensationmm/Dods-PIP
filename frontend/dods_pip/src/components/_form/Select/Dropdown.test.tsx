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
        size="large"
        setValue={mockOnChange}
      />,
    );
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-dropdown"]');
    expect(component.length).toEqual(1);
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
        size="large"
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
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('keyboard use - selects option on keypress', () => {
    const option = wrapper.find('[data-test="option-1"]');
    option.simulate('keypress');
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });
});
