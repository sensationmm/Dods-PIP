import { shallow } from 'enzyme';
import React from 'react';

import SearchDropdown from '.';

describe('SearchDropdown', () => {
  let wrapper;
  const mockOnChange = jest.fn();

  const useStateSpy = jest.spyOn(React, 'useState');
  const setSearch = jest.fn();
  const setResults = jest.fn();

  const defaultState = {
    search: '',
    results: [],
  };

  const props = {
    id: 'example',
    values: [
      { value: 'option1', label: 'abc' },
      { value: 'option2', label: 'abcde' },
      { value: 'option3', label: 'abcd' },
      { value: 'option4', label: 'abdec' },
      { value: 'option5', label: 'abc' },
      { value: 'option5', label: 'abc' },
      { value: 'option6', label: 'abc' },
      { value: 'option7', label: 'abc' },
      { value: 'option8', label: 'abc' },
      { value: 'option9', label: 'abc' },
    ],
    onChange: mockOnChange,
  };

  beforeEach(() => {
    wrapper = shallow(<SearchDropdown {...props} />);
    useStateSpy
      .mockImplementationOnce(() => [defaultState.search, setSearch])
      .mockImplementationOnce(() => [defaultState.results, setResults]);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-search-dropdown"]');
    expect(component.length).toEqual(1);
  });

  it('shows expected results', () => {
    const searchField = wrapper.find('[data-test="search-field"]');
    searchField.props().onChange('abcd');

    expect(setSearch).toHaveBeenCalledWith('abcd');
    expect(setResults).toHaveBeenCalledWith([
      { value: 'option2', label: 'abcde' },
      { value: 'option3', label: 'abcd' },
    ]);
  });

  it('handles search', () => {
    const searchField = wrapper.find('[data-test="search-field"]');
    searchField.props().onChange('ab');

    expect(setSearch).toHaveBeenCalledWith('ab');
    expect(setResults).toHaveBeenCalledWith([
      { value: 'option1', label: 'abc' },
      { value: 'option2', label: 'abcde' },
      { value: 'option3', label: 'abcd' },
      { value: 'option4', label: 'abdec' },
      { value: 'option5', label: 'abc' },
    ]);
  });

  it('handles case insensitive search', () => {
    const searchField = wrapper.find('[data-test="search-field"]');
    searchField.props().onChange('AB');

    expect(setSearch).toHaveBeenCalledWith('AB');
    expect(setResults).toHaveBeenCalledWith([
      { value: 'option1', label: 'abc' },
      { value: 'option2', label: 'abcde' },
      { value: 'option3', label: 'abcd' },
      { value: 'option4', label: 'abdec' },
      { value: 'option5', label: 'abc' },
    ]);
  });

  it('handles helper text', () => {
    wrapper = shallow(<SearchDropdown {...props} helperText="" />);
    const dropdown = wrapper.find('[data-test="results-dropdown"]');
    expect(dropdown.props().hasHelper).toEqual(false);
  });

  it('handles onChange', () => {
    wrapper = shallow(<SearchDropdown {...props} />);
    const dropdown = wrapper.find('[data-test="results-dropdown"]');
    dropdown.props().setValue('test');

    expect(mockOnChange).toHaveBeenCalledWith('test');
    expect(setSearch).toHaveBeenCalledWith('');
    expect(setResults).toHaveBeenCalledWith([]);
  });

  it('opens list on click if isFilter', () => {
    wrapper = shallow(<SearchDropdown {...props} isFilter />);
    wrapper.simulate('click');
    expect(setResults).toHaveBeenCalledWith(props.values);
  });

  it('shows selected value if isFilter', () => {
    wrapper = shallow(<SearchDropdown {...props} isFilter value="option5" />);
    const searchValue = wrapper.find('[data-test="search-value"]');
    expect(searchValue.length).toEqual(1);
    expect(searchValue.props().children).toEqual('abc');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
