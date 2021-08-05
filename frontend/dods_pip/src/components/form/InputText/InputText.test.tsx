import React from 'react';
import { shallow } from 'enzyme';
import InputText from '.';
import { Icons } from '../../Icon/assets';
import Icon from '../../Icon';
import color from '../../../globals/color';

describe('InputText', () => {
  it('renders without error', () => {
    const wrapper = shallow(<InputText label="Example" value={'Example'} onChange={() => {}} />);
    const component = wrapper.find('[data-test="component-input-text"]');
    expect(component.length).toEqual(1);
  });

  it('renders with Icon', () => {
    const wrapper = shallow(
      <InputText label="Example" value={'Example'} onChange={() => {}} icon={Icons.IconCross} />,
    );
    const component = wrapper.find(Icon);
    expect(component.length).toEqual(1);
  });

  it('renders icon in disabled state', () => {
    const wrapper = shallow(
      <InputText
        label="Example"
        isDisabled={true}
        value={''}
        onChange={() => {}}
        icon={Icons.IconCross}
      />,
    );
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.base.grey);
  });

  it('renders icon in error state', () => {
    const wrapper = shallow(
      <InputText
        label="Example"
        hasError={true}
        value={''}
        onChange={() => {}}
        icon={Icons.IconCross}
      />,
    );
    const component = wrapper.find(Icon);
    expect(component.props().color).toEqual(color.alert.red);
  });

  it('fires onChange method', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(<InputText label="Example" value={''} onChange={typeWatcher} />);
    const component = wrapper.find('[data-test="component-input-text"]');
    component.simulate('focus');
    component.simulate('change', { target: { value: 'new' } });
    expect(typeWatcher).toHaveBeenCalledTimes(1);
    expect(typeWatcher).toHaveBeenCalledWith('new');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
