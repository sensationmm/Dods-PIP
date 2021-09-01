import { shallow } from 'enzyme';
import React from 'react';

import AZFilter from '.';
import color from '../../globals/color';
import Icon from '../Icon';
import Text from '../Text';

describe('AZ Filter', () => {
  let wrapper, onClick, setState, useStateSpy;
  const defaultState = {
    hoveringAzFilter: false,
    selectedLetter: '',
  };
  let count = 0;

  const states = [
    defaultState, // renders without error
    defaultState, // resets letter filter
    defaultState, // sets letter filter
    defaultState, // sets hover on mouseenter
    defaultState, // clears hover on mouseleave
    { ...defaultState, selectedLetter: 'L' }, // handles selected letter
    { ...defaultState, hoveringAzFilter: true, selectedLetter: 'L' }, // handles hovered selected letter
    { ...defaultState, hoveringAzFilter: true, selectedLetter: 'B' }, // handles hovered unselected letter
  ];

  beforeEach(() => {
    onClick = jest.fn();
    setState = jest.fn();
    useStateSpy = jest.spyOn(React, 'useState');
    wrapper = shallow(<AZFilter onClick={onClick} />);

    useStateSpy
      .mockImplementationOnce(() => [states[count].hoveringAzFilter, setState])
      .mockImplementationOnce(() => [states[count].selectedLetter, setState]);
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-AZFilter"]');
    const viewAll = wrapper.find('[data-test="button-all"]');
    expect(component.length).toEqual(1);
    expect(viewAll.find(Icon).props().color).toEqual(color.base.black);
    expect(viewAll.find(Text).props().color).toEqual(color.theme.blue);
  });

  it('resets letter filter', () => {
    const viewAll = wrapper.find('[data-test="button-all"]');
    viewAll.simulate('click');
    expect(onClick).toHaveBeenCalledWith('');
    expect(setState).toHaveBeenCalledWith('');
  });

  it('sets letter filter', () => {
    const letter = wrapper.find('[data-test="button-F"]');
    letter.simulate('click');
    expect(onClick).toHaveBeenCalledWith('F');
    expect(setState).toHaveBeenCalledWith('F');
  });

  it('sets hover on mouseenter', () => {
    const filter = wrapper.find('[data-test="component-AZFilter"]');
    filter.simulate('mouseenter');
    expect(setState).toHaveBeenCalledWith(true);
  });

  it('clears hover on mouseleave', () => {
    const filter = wrapper.find('[data-test="component-AZFilter"]');
    filter.simulate('mouseleave');
    expect(setState).toHaveBeenCalledWith(false);
  });

  it('handles selected letter', () => {
    const viewAll = wrapper.find('[data-test="button-all"]');
    const letter = wrapper.find('[data-test="button-L"]');
    expect(viewAll.find(Icon).props().color).toEqual(color.base.grey);
    expect(viewAll.find(Text).props().color).toEqual(color.base.grey);
    expect(letter.find(Text).props().color).toEqual(color.base.white);
  });

  it('handles hovered selected letter', () => {
    const viewAll = wrapper.find('[data-test="button-all"]');
    const letter = wrapper.find('[data-test="button-L"]');
    expect(viewAll.find(Icon).props().color).toEqual(color.base.grey);
    expect(viewAll.find(Text).props().color).toEqual(color.base.grey);
    expect(letter.find(Text).props().color).toEqual(color.base.white);
  });

  it('handles hovered unselected letter', () => {
    const viewAll = wrapper.find('[data-test="button-all"]');
    const letter = wrapper.find('[data-test="button-L"]');
    expect(viewAll.find(Icon).props().color).toEqual(color.base.grey);
    expect(viewAll.find(Text).props().color).toEqual(color.base.grey);
    expect(letter.find(Text).props().color).toEqual(color.theme.blue);
  });

  afterEach(() => {
    jest.clearAllMocks();
    count++;
  });
});
