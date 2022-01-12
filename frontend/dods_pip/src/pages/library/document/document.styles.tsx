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
  background: ${color.base.white};
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(18 32 53 / 16%);
  padding: ${spacing(6)};

  ${media.greaterThan(breakpoint)`
    width: 350px;
  `}

  h3 {
    margin-bottom: ${spacing(6)};
  }

  label {
    font-size: 18px;
    display: block;
    margin-bottom: ${spacing(4)};
    text-transform: capitalize !important;
  }
`;

export const tagsContainer = styled.div`
  display: flex;
  gap: ${spacing(2)};
  margin-bottom: ${spacing(8)};
`;

export const tag = styled.span`
  font-size: 16px;
  background: ${color.base.greyLight};
  color: ${color.theme.blue};
  border-radius: 60px;
  padding: ${spacing(2)} ${spacing(3)};
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
