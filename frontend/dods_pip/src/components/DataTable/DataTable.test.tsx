import { shallow } from 'enzyme';
import React from 'react';

import DataTable, { DataTableHeading, DataTableRows, DataTableSort } from '.';

describe('DataTable', () => {
  const defaultProps = {
    headings: ['heading1', 'heading2', 'heading3'],
    rows: [
      ['A', <div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
      ['A', <div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
      ['A', <div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
      ['B', <div>Column1</div>, <div>Column2</div>, <div>Column3</div>],
    ],
  };

  it('renders without error', () => {
    const wrapper = shallow(<DataTable {...defaultProps} />);
    const component = wrapper.find('[data-test="component-data-table"]');
    expect(component.length).toEqual(1);

    const rows = wrapper.find('[data-test="data-table-rows"]');
    expect(rows.length).toEqual(1);

    const emptyWarning = wrapper.find('[data-test="empty-data-warning"]');
    expect(emptyWarning.length).toEqual(0);
  });

  it('handles empty data set', () => {
    const wrapper = shallow(<DataTable {...defaultProps} rows={[]} />);
    const component = wrapper.find('[data-test="component-data-table"]');
    expect(component.length).toEqual(1);

    const rows = wrapper.find('[data-test="data-table-rows"]');
    expect(rows.length).toEqual(0);

    const emptyWarning = wrapper.find('[data-test="empty-data-warning"]');
    expect(emptyWarning.length).toEqual(1);
  });

  describe('DataTableHeading', () => {
    it('renders without error', () => {
      const wrapper = shallow(<DataTableHeading headings={defaultProps.headings} />);
      const component = wrapper.find('[data-test="data-table-headings"]');
      expect(component.length).toEqual(1);
    });

    it('renders custom widths', () => {
      const wrapper = shallow(
        <DataTableHeading headings={defaultProps.headings} colWidths={[3, 2, 1]} />,
      );
      const heading1 = wrapper.find('[data-test="heading-0"]');
      const heading2 = wrapper.find('[data-test="heading-1"]');
      const heading3 = wrapper.find('[data-test="heading-2"]');

      expect(heading1.props().style.width).toEqual('50%');
      expect(heading2.props().style.width).toEqual('33%');
      expect(heading3.props().style.width).toEqual('16%');
    });
  });

  describe('DataTableRows', () => {
    it('renders without error', () => {
      const wrapper = shallow(<DataTableRows rows={defaultProps.rows} />);
      const component = wrapper.find('[data-test="data-table-rows"]');
      expect(component.length).toEqual(1);

      const headers = wrapper.find('[data-test="block-header"]');
      expect(headers.length).toEqual(2);
      expect(headers.at(0).text()).toEqual('A');
      expect(headers.at(1).text()).toEqual('B');
    });
  });

  describe('DataTableSort', () => {
    it('sorts data', () => {
      const data = [{ name: 'C' }, { name: 'A' }, { name: 'D' }, { name: 'B' }];
      const sortedData = DataTableSort(data);
      expect(sortedData).toEqual([{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }]);
    });
  });
});
