import React from 'react';

import * as Styled from './DataTable.styles';

type DataTableHeadingProps = {
  headings: Array<string>;
  colWidths?: Array<number>;
};

type DataTableRowProps = {
  rows: Array<Array<string | JSX.Element>>;
};

type DataObject = {
  [key: string]: string;
};

export type DataTableDataProps = {
  data: Array<DataObject>;
};

export interface DataTableProps extends DataTableHeadingProps, DataTableRowProps {}

export const DataTableHeading: React.FC<DataTableHeadingProps> = ({ headings, colWidths }) => {
  const totalWidths = colWidths ? colWidths.reduce((prev, curr) => prev + curr, 0) : 0;

  return (
    <Styled.tableHead data-test="data-table-headings">
      <Styled.tableRow>
        {headings.map((item, count) => (
          <Styled.tableHeading
            key={`heading-${count}`}
            data-test={`heading-${count}`}
            style={{
              width: colWidths ? `${Math.floor((colWidths[count] / totalWidths) * 100)}%` : 'auto',
            }}
          >
            {item}
          </Styled.tableHeading>
        ))}
      </Styled.tableRow>
    </Styled.tableHead>
  );
};

export const DataTableRows: React.FC<DataTableRowProps> = ({ rows }) => {
  let block = '';

  return (
    <Styled.tableBody data-test="data-table-rows">
      {rows.map((item, count) => {
        const row = [];
        if (item[0] !== block) {
          row.push(
            <Styled.tableRow key="row-header-empty">
              <Styled.tableCellEmpty isFirst={block === ''} colSpan={item.length} />
            </Styled.tableRow>,
            <Styled.tableRow data-test="block-header" key={`row-header-${count}`}>
              <Styled.tableBlockHeader colSpan={item.length}>{item[0]}</Styled.tableBlockHeader>
            </Styled.tableRow>,
          );
        }
        row.push(
          <Styled.tableRow key={`row-${count}`}>
            {item.slice(1).map((col, count2) => {
              return (
                <Styled.tableCell
                  key={`row-${count}-col-${count2}`}
                  isLast={count === rows.length - 1 || item[0] !== rows[count + 1][0]}
                >
                  {col}
                </Styled.tableCell>
              );
            })}
          </Styled.tableRow>,
        );
        block = item[0] as string;
        return row;
      })}
    </Styled.tableBody>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,  @typescript-eslint/no-explicit-any
export const DataTableSort = (data: any): any => {
  return data.sort((a: DataObject, b: DataObject) => {
    return a.name >= b.name ? 1 : -1;
  });
};

const DataTable: React.FC<DataTableProps> = ({ headings, colWidths, rows }) => (
  <Styled.wrapper data-test="component-data-table" cellSpacing={0}>
    <DataTableHeading headings={headings} colWidths={colWidths} />
    {rows.length > 0 ? (
      <DataTableRows data-test="data-table-rows" rows={rows} />
    ) : (
      <Styled.tableBody>
        <Styled.tableRow>
          <Styled.tableCellEmpty isFirst colSpan={headings.length} />
        </Styled.tableRow>
        <Styled.tableRow>
          <Styled.tableCellNoData data-test="empty-data-warning" colSpan={headings.length}>
            No data to show
          </Styled.tableCellNoData>
        </Styled.tableRow>
      </Styled.tableBody>
    )}
  </Styled.wrapper>
);

export default DataTable;
