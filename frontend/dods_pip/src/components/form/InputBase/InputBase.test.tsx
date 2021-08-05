import React from 'react';
import { shallow } from 'enzyme';
import InputBase from '.';

describe('InputBase onChange={() => {}}', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <InputBase onChange={() => {}} type="text" label="Example" value="Example" />,
    );
    const component = wrapper.find('[data-test="component-input-base"]');
    expect(component.length).toEqual(1);
  });

  it('renders value in field if given', () => {
    const wrapper = shallow(
      <InputBase onChange={() => {}} type="text" label="Label" value="Value" />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    expect(component.props().value).toEqual('Value');
  });

  it('renders label in field if no value', () => {
    const wrapper = shallow(<InputBase onChange={() => {}} type="text" label="Label" value="" />);
    const component = wrapper.find('[data-test="component-input-base-input"]');
    expect(component.props().value).toEqual('Label');
  });

  it('renders helper text if given', () => {
    const wrapper = shallow(
      <InputBase onChange={() => {}} type="text" label="Label" value="" helperText="Help" />,
    );
    const component = wrapper.find('[data-test="component-input-base-helper"]');
    expect(component.props().children).toEqual('Help');
  });

  it('does not render helper text if absent', () => {
    const wrapper = shallow(<InputBase onChange={() => {}} type="text" label="Label" value="" />);
    const component = wrapper.find('[data-test="component-input-base-helper"]');
    expect(component.length).toEqual(0);
  });

  it('renders disabled state', () => {
    const wrapper = shallow(
      <InputBase
        onChange={() => {}}
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
        onChange={() => {}}
        type="text"
        label="Label"
        helperText="Help"
        value="Value"
        hasError={true}
      />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    expect(component.hasClass('disabled')).toEqual(false);
    expect(component.hasClass('error')).toEqual(true);
  });

  it('renders error & disabled state', () => {
    const wrapper = shallow(
      <InputBase
        onChange={() => {}}
        type="text"
        label="Label"
        value="Value"
        helperText="Help"
        isDisabled={true}
        hasError={true}
      />,
    );
    const component = wrapper.find('[data-test="component-input-base-input"]');
    expect(component.hasClass('disabled')).toEqual(true);
    expect(component.hasClass('error')).toEqual(true);
  });
});
