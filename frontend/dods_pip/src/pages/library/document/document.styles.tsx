import styled from 'styled-components';

import color from '../../../globals/color';
import media from '../../../globals/media';
import spacing from '../../../globals/spacing';

const breakpoint = 'lg';

export const body = styled.div`
  ${media.greaterThan(breakpoint)`
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: ${spacing(5)};
  `}
`;

export const main = styled.main`
  color: ${color.theme.blue};
  width: 100%;

  ${media.greaterThan(breakpoint)`
    flex: 1;
  `}

  h2 {
    font-family: 'Libre Baskerville';
    font-size: 24px;
  }

  p {
    font-size: 16px;
    line-height: 22px;
  }
`;

export const tags = styled.aside`
  width: 100%;
  margin-bottom: ${spacing(6)};

  ${media.greaterThan(breakpoint)`
    width: 350px;
  `}
`;

export const tabs = styled.div`
  margin-bottom: ${spacing(5)};
`;

export const tab = styled.button`
  width: 50%;
  text-align: center;
  font-size: 18px;
  font-weight: normal;
  line-height: 40px;
  border: 0;
  background: transparent;
  color: ${color.theme.blue};
  cursor: pointer;
  border-bottom: 1px solid ${color.base.greyMid};
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0px;
    height: 0px;
    transition: all 0.25s;
  }

  &.selected {
    font-weight: bold;

    &:after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 4px;
      background: ${color.theme.blueLight};
    }
  }
`;

export const detailTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    height: 37px;
    padding: ${spacing(2)} 0;
    border-bottom: 1px solid ${color.base.greyLight};
  }

  tr:last-child td {
    border-bottom: 0;
  }
`;
