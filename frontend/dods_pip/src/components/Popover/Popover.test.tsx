import { shallow, mount } from 'enzyme';
import React from 'react';
import Popover from '.';
import OutsideClickHandler from 'react-outside-click-handler';

describe('Popover', () => {
  it('renders without error', () => {
    const wrapper = shallow(<Popover />);
    const component = wrapper.find('[data-test="popover"]');
    expect(component.length).toEqual(1);
  });

  const defaultState = { show: false };
  let useStateSpy, mockSetShow;

  it('renders button click events', () => {
    useStateSpy = jest.spyOn(React, 'useState');
    mockSetShow = jest.fn();
    useStateSpy.mockImplementation(() => [defaultState.show, mockSetShow]);
    const wrapper = mount(<Popover />);
    const btn = wrapper.find('button');
    btn.simulate('click');
    expect(mockSetShow).toHaveBeenCalledWith(true);
  });

  it('renders outside click event', () => {
    const wrapper = shallow(<Popover />);
    const clickOutside = wrapper.find(OutsideClickHandler);
    clickOutside.props().onOutsideClick();
    expect(mockSetShow).toHaveBeenCalledWith(false);
  });
});
