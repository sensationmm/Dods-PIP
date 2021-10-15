import { shallow } from 'enzyme';
import React from 'react';

import color from '../../../globals/color';
import Icon from '../../Icon';
import { Icons } from '../../Icon/assets';
import InputText from '.';

describe('InputText', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <InputText id="test" label="Example" value={'Example'} onChange={jest.fn} />,
    );
    const component = wrapper.find('[data-test="component-input-text"]');
    expect(component.length).toEqual(1);
  });

  it('renders with Icon', () => {
    const wrapper = shallow(
      <InputText
        id="test"
        label="Example"
        value={'Example'}
        onChange={jest.fn}
        icon={Icons.Cross}
      />,
    );
    const component = wrapper.find(Icon);
    expect(component.length).toEqual(1);
  });

  it('renders icon in disabled state', () => {
    const wrapper = shallow(
      <InputText
        id="test"
        label="Example"
        isDisabled={true}
        value={''}
        onChange={jest.fn}
        icon={Icons.Cross}
      />,
    );
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.base.grey);
  });

  it('renders icon in error state', () => {
    const wrapper = shallow(
      <InputText
        id="test"
        label="Example"
        error={'yes'}
        value={''}
        onChange={jest.fn}
        icon={Icons.Cross}
      />,
    );
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.alert.red);
  });

  it('fires onChange method', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(
      <InputText id="test" label="Example" value={''} onChange={typeWatcher} />,
    );
    const component = wrapper.find('[data-test="component-input-text"]');
    component.simulate('focus');
    component.simulate('change', 'new');
    expect(typeWatcher).toHaveBeenCalledTimes(1);
    expect(typeWatcher).toHaveBeenCalledWith('new');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
