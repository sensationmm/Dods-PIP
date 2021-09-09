import { shallow } from 'enzyme';
import React from 'react';

import Select from '.';

describe('Select', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <Select
        id="example"
        value=""
        onChange={jest.fn}
        options={[
          { name: 'Option 1', value: 'option1' },
          { name: 'Option 2', value: 'option2' },
          { name: 'Option 3', value: 'option3' },
        ]}
      />,
    );
    const component = wrapper.find('[data-test="component-select"]');
    expect(component.length).toEqual(1);
  });
});
