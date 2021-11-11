import { shallow, mount } from 'enzyme';
import React from 'react';

import TagSelector from '.';
import { Icons } from '../Icon/assets';

describe('TagSelector', () => {
  let wrapper;

  let count = 0;

  const useStateSpy = jest.spyOn(React, 'useState');
  const mockSetDeleteTag = jest.fn();
  const mockSetIsFocused = jest.fn();
  const mockOnChange = jest.fn();

  const defaultProps = {
    id: 'example',
    title: 'Example',
    onChange: mockOnChange,
    emptyMessage: 'Empty',
    icon: Icons.Cross,
    values: [
      { value: 'test1', label: 'Test 1' },
      { value: 'test2', label: 'Test 2' },
      { value: 'test3', label: 'Test 3' },
    ],
    selectedValues: ['test1', 'test2'],
  };

  const defaultState = {
    deleteTag: '',
    isFocused: false,
  };

  const states = [
    defaultState, // renders without error
    defaultState, // renders empty state
    defaultState, // handles no values passed
    defaultState, // sets hover state
    defaultState, // clears hover state
    defaultState, // adds tag
    defaultState, // deletes tag
  ];

  beforeEach(() => {
    useStateSpy.mockImplementationOnce(() => [states[count].isFocused, mockSetIsFocused]);
    wrapper = shallow(<TagSelector {...defaultProps} />);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-tag-selector"]');
    const chips = wrapper.find('[data-test="chips"]');
    expect(component.length).toEqual(1);
    expect(chips.length).toEqual(2);
  });

  it('renders empty state', () => {
    wrapper = shallow(<TagSelector {...defaultProps} selectedValues={[]} />);
    const chips = wrapper.find('[data-test="chips"]');
    expect(chips.length).toEqual(0);
  });

  it('handles no values passed', () => {
    wrapper = shallow(<TagSelector {...defaultProps} selectedValues={undefined} />);
    const chips = wrapper.find('[data-test="chips"]');
    expect(chips.length).toEqual(0);
  });

  it('sets hover state', () => {
    const search = wrapper.find('[id="search-team-member"]');
    search.simulate('focus');
    expect(mockSetIsFocused).toHaveBeenCalledWith(true);
  });

  it('clears hover state', () => {
    const search = wrapper.find('[id="search-team-member"]');
    search.simulate('blur');
    expect(mockSetIsFocused).toHaveBeenCalledWith(false);
  });

  it('adds tag', () => {
    const search = wrapper.find('[id="search-team-member"]');
    search.props().onChange('test3');

    expect(mockOnChange).toHaveBeenCalledWith(['test1', 'test2', 'test3']);
  });

  it('deletes tag', () => {
    wrapper = mount(<TagSelector {...defaultProps} />);
    const search = wrapper.find('[data-test="chips"]').at(1);
    search.props().onCloseClick('test2');

    expect(mockOnChange).toHaveBeenCalledWith(['test1']);
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
