import { shallow } from 'enzyme';
import React from 'react';

import DataTable from '.';

describe('DataTable', () => {
  it('renders without error', () => {
    const wrapper = shallow(
      <DataTable
        headings={['heading1', 'heading2', 'heading3']}
        rows={[
          [<div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
          [<div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
          [<div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
          [<div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
        ]}
      />,
    );
    const component = wrapper.find('[data-test="component-data-table"]');
    expect(component.length).toEqual(1);
  });
});
