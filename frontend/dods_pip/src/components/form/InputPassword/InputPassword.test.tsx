import React from 'react';
import { shallow } from 'enzyme';
import InputPassword from '.';
import Input from '../InputBase';
import Icon from '../../Icon';
import color from '../../../globals/color';

describe('InputPassword', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <InputPassword label="Example" value={'Example'} onChange={() => {}} />,
    );
    const component = wrapper.find('[data-test="component-input-password"]');
    expect(component.length).toEqual(1);
  });

  it('renders password version', () => {
    const wrapper = shallow(
      <InputPassword label="Example" value={'Example'} onChange={() => {}} />,
    );
    const input = wrapper.find(Input);
    expect(input.props().type).toEqual('password');
  });

  it('renders text version', () => {
    const wrapper = shallow(
      <InputPassword label="Example" value={'Example'} onChange={() => {}} />,
    );
    const toggle = wrapper.find('[data-test="password-toggle"]');
    toggle.simulate('click');
    const input = wrapper.find(Input);
    expect(input.props().type).toEqual('text');
  });

  it('renders disabled state', () => {
    const wrapper = shallow(
      <InputPassword label="Example" isDisabled={true} value={''} onChange={() => {}} />,
    );
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.base.grey);
  });

  it('renders error state', () => {
    const wrapper = shallow(
      <InputPassword label="Example" hasError={true} value={''} onChange={() => {}} />,
    );
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.alert.red);
  });

  it('toggles show/hide password', () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    // @ts-ignore
    useStateSpy.mockImplementation((init: boolean) => [init, setState]);

    const wrapper = shallow(
      <InputPassword label="Example" value={'Example'} onChange={() => {}} />,
    );
    const toggle = wrapper.find('[data-test="password-toggle"]');
    toggle.simulate('click');
    expect(setState).toHaveBeenCalledWith(true);
  });

  it('fires onChange method', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(<InputPassword label="Example" value={''} onChange={typeWatcher} />);
    const component = wrapper.find('[data-test="component-input-password"]');
    component.simulate('focus');
    component.simulate('change', { target: { value: 'new' } });
    expect(typeWatcher).toHaveBeenCalledTimes(1);
    expect(typeWatcher).toHaveBeenCalledWith('new');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
