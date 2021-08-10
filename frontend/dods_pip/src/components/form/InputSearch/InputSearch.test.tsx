import React from 'react';
import { shallow } from 'enzyme';
import InputSearch from '.';
import InputBase from '../InputBase';
import Icon from '../../Icon';
import color from '../../../globals/color';

describe('InputSearch', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <InputSearch id="test" label="Example" value={'Example'} onChange={() => {}} />,
    );
    const component = wrapper.find('[data-test="component-input-search"]');
    expect(component.length).toEqual(1);
  });

  it('renders default label', () => {
    const wrapper = shallow(<InputSearch id="test" value={''} onChange={() => {}} />);
    const component = wrapper.find(InputBase);
    expect(component.props().label).toEqual('Search...');
  });

  it('renders label override', () => {
    const wrapper = shallow(
      <InputSearch id="test" label="Example" value={'Example'} onChange={() => {}} />,
    );
    const component = wrapper.find(InputBase);
    expect(component.props().label).toEqual('Example');
  });

  it('renders disabled state', () => {
    const wrapper = shallow(
      <InputSearch id="test" isDisabled={true} value={''} onChange={() => {}} />,
    );
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.base.grey);
  });

  it('renders error state', () => {
    const wrapper = shallow(<InputSearch id="test" error={'yes'} value={''} onChange={() => {}} />);
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.alert.red);
  });

  it('fires onChange method', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(
      <InputSearch id="test" label="Example" value={''} onChange={typeWatcher} />,
    );
    const component = wrapper.find('[data-test="component-input-search"]');
    component.simulate('focus');
    component.simulate('change', { target: { value: 'new' } });
    expect(typeWatcher).toHaveBeenCalledTimes(1);
    expect(typeWatcher).toHaveBeenCalledWith('new');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
