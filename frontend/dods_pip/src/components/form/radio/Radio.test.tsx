import React from 'react';
import { shallow } from 'enzyme';
// import RadioGroup from '.';
import { Radio } from '.';

const exampleArgs = {
  name: 'Example',
  items: [
    { label: 'first', value: 'first' },
    { label: 'second', value: 'second' },
    { label: 'third', value: 'third' },
  ],
  selectedValue: 'first',
  handleChange: () => {},
};

// describe('RadioGroup', () => {
//   it('renders without error', () => {
//     const wrapper = shallow(<RadioGroup {...exampleArgs} />);
//     const component = wrapper.find('[data-test="component-radio-group"]');
//     expect(component.length).toEqual(1);
//   });
// });

describe('Radio', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <Radio
        id={'test'}
        name={exampleArgs.name}
        onChange={exampleArgs.handleChange}
        {...exampleArgs.items[0]}
      />,
    );
    const component = wrapper.find('[data-test="component-radio"]');
    const input = component.find('[data-test="radio-input"]');
    expect(component.length).toEqual(1);
    expect(input.props().checked).toEqual(false);
  });

  it('renders checked state', () => {
    const wrapper = shallow(
      <Radio
        id={'test'}
        name={exampleArgs.name}
        onChange={exampleArgs.handleChange}
        {...exampleArgs.items[0]}
        isChecked={true}
      />,
    );
    const component = wrapper.find('[data-test="component-radio"]');
    const input = component.find('[data-test="radio-input"]');
    expect(input.props().checked).toEqual(true);
  });

  it('renders disabled state', () => {
    const wrapper = shallow(
      <Radio
        id={'test'}
        name={exampleArgs.name}
        onChange={exampleArgs.handleChange}
        {...exampleArgs.items[0]}
        isChecked={true}
        isDisabled={true}
      />,
    );
    const component = wrapper.find('[data-test="component-radio"]');
    expect(component.children().first().hasClass('disabled')).toEqual(true);
  });
});
