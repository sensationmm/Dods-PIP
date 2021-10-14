import { shallow } from 'enzyme';
import React from 'react';

import RadioGroup from '.';
import { Radio } from '.';

const exampleArgs = {
  id: 'test',
  name: 'Example',
  items: [
    { label: 'first', value: 'first' },
    { label: 'second', value: 'second' },
    { label: 'third', value: 'third' },
  ],
  selectedValue: 'first',
  onChange: jest.fn(),
};

describe('RadioGroup', () => {
  it('renders without error', () => {
    const wrapper = shallow(<RadioGroup {...exampleArgs} onChange={jest.fn} value="first" />);
    const component = wrapper.find('[data-test="component-Radio-group"]');
    expect(component.length).toEqual(1);
  });

  it('shows label if given', () => {
    const wrapper = shallow(
      <RadioGroup {...exampleArgs} onChange={jest.fn} value="first" label="Label" />,
    );
    const label = wrapper.find('[data-test="Radio-group-label"]');
    expect(label.length).toEqual(1);
  });
});

describe('Radio', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Radio
        id={'test'}
        name={exampleArgs.name}
        onChange={exampleArgs.onChange}
        {...exampleArgs.items[0]}
      />,
    );
  });

  it('renders without error', () => {
    const component = wrapper.find('[data-test="component-Radio"]');
    const input = component.find('[data-test="Radio-input"]');
    expect(component.length).toEqual(1);
    expect(input.props().checked).toEqual(false);
  });

  it('handles click', () => {
    const input = wrapper.find('[data-test="Radio-input"]');
    input.props().onChange();
    expect(exampleArgs.onChange).toHaveBeenCalledWith('first');
  });

  it('renders checked state', () => {
    wrapper = shallow(
      <Radio
        id={'test'}
        name={exampleArgs.name}
        onChange={exampleArgs.onChange}
        {...exampleArgs.items[0]}
        isChecked={true}
      />,
    );
    const component = wrapper.find('[data-test="component-Radio"]');
    const input = component.find('[data-test="Radio-input"]');
    expect(input.props().checked).toEqual(true);
  });

  it('renders disabled state', () => {
    wrapper = shallow(
      <Radio
        id={'test'}
        name={exampleArgs.name}
        onChange={exampleArgs.onChange}
        {...exampleArgs.items[0]}
        isDisabled={true}
      />,
    );
    const component = wrapper.find('[data-test="component-Radio"]');
    expect(component.children().first().hasClass('disabled')).toEqual(true);
  });
});
