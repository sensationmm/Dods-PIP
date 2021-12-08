import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';

export const wrapper = styled.table`
  width: 100%;
`;

export const tableHead = styled.thead``;

export const tableHeading = styled.th`
  color: ${color.theme.blueMid};
  padding: ${spacing(3)} ${spacing(8)};
  background: ${color.shadow.blue};
  text-align: left;

  &:first-child {
    border-radius: 8px 0 0 8px;
  }

  &:last-child {
    border-radius: 0 8px 8px 0;
  }
`;

export const tableBody = styled.tbody``;

export const tableRow = styled.tr``;

export const tableBlockHeader = styled.td`
  color: ${color.theme.blueMid};
  padding: ${spacing(3)} ${spacing(8)};
  background: ${color.shadow.blue};
  text-align: left;
  border-radius: 8px 8px 0 0;
  font-family: 'Libre Baskerville';
  font-size: 24px;
`;

type TableCellProps = {
  isLast: boolean;
};

export const tableCell = styled.td<TableCellProps>`
  position: relative;
  padding: ${spacing(5)} ${spacing(8)};
  background: ${color.base.white};
  border-bottom: 1px solid ${color.shadow.blue};
  text-align: left;

  &:first-child {
    border-left: 1px solid ${color.shadow.blue};
    border-radius: ${({ isLast }) => (isLast ? '0 0 0 8px' : '0')};
  }

  &:last-child {
    border-right: 1px solid ${color.shadow.blue};
    border-radius: ${({ isLast }) => (isLast ? '0 0 8px 0' : '0')};
  }
`;

type TableCellEmptyProps = {
  isFirst: boolean;
};

export const tableCellEmpty = styled.td<TableCellEmptyProps>`
  height: ${({ isFirst }) => (isFirst ? spacing(2) : spacing(4))};
`;

export const tableCellNoData = styled.td`
  position: relative;
  padding: ${spacing(5)} ${spacing(8)};
  background: ${color.base.white};
  border: 1px solid ${color.shadow.blue};
  text-align: center;
  border-radius: 8px;
`;

export const plainTableHeading = styled.th`
  color: ${color.theme.blue};
  border-bottom: 1px solid ${color.shadow.blue};
  padding: ${spacing(3)} ${spacing(8)};
  background: ${color.base.white};
  text-align: left;
`;

export const plainTableCell = styled.td<TableCellProps>`
  position: relative;
  padding: ${spacing(5)} ${spacing(8)};
  background: ${color.base.white};
  border-bottom: 1px solid ${color.shadow.blue};
  text-align: left;
  vertical-align: center;
`;

export const plainCellNoData = styled.td`
  position: relative;
  padding: ${spacing(5)} ${spacing(8)};
  background: ${color.base.white};
  border-bottom: 1px solid ${color.shadow.blue};
  text-align: center;
`;
