import { shallow } from 'enzyme';
import React from 'react';

import InputBase from '.';
import Label from '../Label';

describe('InputBase onChange={jest.fn}', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <InputBase id="test" onChange={jest.fn} type="text" label="Example" value="Example" />,
    );
    const component = wrapper.find('[data-test="component-input-base"]');
    const label = wrapper.find(Label);
    expect(label.length).toEqual(1);
    expect(component.length).toEqual(1);
  });

  it('renders value in field if given', () => {
    const wrapper = shallow(
      <InputBase id="test" onChange={jest.fn} type="text" label="Label" value="Value" />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    expect(component.props().value).toEqual('Value');
  });

  it('renders helper text if given', () => {
    const wrapper = shallow(
      <InputBase
        id="test"
        onChange={jest.fn}
        type="text"
        label="Label"
        value=""
        helperText="Help"
      />,
    );
    const component = wrapper.find('[data-test="component-input-base-helper"]');
    expect(component.props().children).toEqual('Help');
  });

  it('renders error override to helper text if given', () => {
    const wrapper = shallow(
      <InputBase
        id="test"
        onChange={jest.fn}
        type="text"
        label="Label"
        value=""
        helperText="Help"
        error="ERROR"
      />,
    );
    const component = wrapper.find('[data-test="component-input-base-helper"]');
    expect(component.props().children).toEqual('ERROR');
  });

  it('does not render helper text if absent', () => {
    const wrapper = shallow(
      <InputBase id="test" onChange={jest.fn} type="text" label="Label" value="" />,
    );
    const component = wrapper.find('[data-test="component-input-base-helper"]');
    expect(component.length).toEqual(0);
  });

  it('renders disabled state', () => {
    const wrapper = shallow(
      <InputBase
        id="test"
        onChange={jest.fn}
        type="text"
        label="Label"
        value="Value"
        helperText="Help"
        isDisabled={true}
      />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    expect(component.hasClass('disabled')).toEqual(true);
    expect(component.hasClass('error')).toEqual(false);
  });

  it('renders error state', () => {
    const wrapper = shallow(
      <InputBase
        id="test"
        onChange={jest.fn}
        type="text"
        label="Label"
        helperText="Help"
        value="Value"
        error={'yes'}
      />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    const helper = wrapper.find('[data-test="component-input-base-helper"]');
    expect(helper.props().children).toEqual('yes');
    expect(component.hasClass('disabled')).toEqual(false);
    expect(component.hasClass('error')).toEqual(true);
  });

  it('renders error & disabled state', () => {
    const wrapper = shallow(
      <InputBase
        id="test"
        onChange={jest.fn}
        type="text"
        label="Label"
        value="Value"
        helperText="Help"
        isDisabled={true}
        error={'yes'}
      />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    expect(component.hasClass('disabled')).toEqual(true);
    expect(component.hasClass('error')).toEqual(true);
  });

  it('fires onChange method', () => {
    const typeWatcher = jest.fn();
    const wrapper = shallow(
      <InputBase id="test" type="text" label="Example" value={''} onChange={typeWatcher} />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    component.simulate('focus');
    component.simulate('change', { target: { value: 'new' } });
    expect(typeWatcher).toHaveBeenCalledTimes(1);
    expect(typeWatcher).toHaveBeenCalledWith('new');
  });
});
