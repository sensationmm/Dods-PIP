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
