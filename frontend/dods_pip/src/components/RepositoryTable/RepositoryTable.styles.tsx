import styled from 'styled-components';

import color from '../../globals/color';
import dropShadow from '../../globals/elevation';
import media from '../../globals/media';
import spacing from '../../globals/spacing';
import { wrapper as Tooltip } from '../Tooltip/Tooltip.styles';

export const wrapper = styled.div`
  width: 100%;
  position: relative;

  ${media.lessThan('md')`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: ${spacing(5)};
    row-gap: ${spacing(5)};
  `};

  ${media.lessThan('sm')`
    display: grid;
    grid-template-columns: 1fr;
    column-gap: ${spacing(5)};
    row-gap: ${spacing(5)};
  `};
`;

export const header = styled.div`
  display: flex;
  justify-content: space-between;

  ${media.lessThan('md')`
    display: none;
  `};
`;

export const tableHeading = styled.div`
  padding-bottom: ${spacing(3)};
`;

export const tableHeadingTitle = styled(tableHeading)`
  text-align: left;
`;

export const tableHeadingStatus = styled(tableHeading)`
  text-align: center;
  width: calc(180px + ${spacing(4)});
`;

type TableRowProps = {
  locked: boolean;
};

export const tableRow = styled.div<TableRowProps>`
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  border-radius: 8px;
  position: relative;
  margin-bottom: ${spacing(2)};
  border: 1px solid ${color.base.greyLight};
  background-color: ${({ locked }) => (locked ? color.base.greyLighter : color.base.white)};
  box-shadow: ${dropShadow.dropShadow1};

  > div {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 420px;
  }

  > div > div {
    padding: ${spacing(3)} ${spacing(4)};

    &:first-child {
      overflow-x: hidden;
    }
  }

  &:after {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    box-shadow: ${dropShadow.dropShadow1};
    z-index: 0;
  }

  &:hover {
    box-shadow: ${({ locked }) => (!locked ? dropShadow.notification : dropShadow.dropShadow1)};
    > div {
      grid-template-columns: ${({ locked }) => (locked ? '1fr 420px' : '1fr 590px')};
    }
  }

  ${media.lessThan('md')`
    width: 100%;
    display: grid;
    padding: ${spacing(3)} ${spacing(4)};
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 40px;
    grid-row-gap: ${spacing(6)};

    > div {
      display: block;
      width: 100%;
    }

    > div > div {
      padding: 0;
    }

    &:hover {
      > div {
        grid-template-columns: 1fr;
      }
    }
  `};
`;

export const tableTitle = styled.div<TableRowProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${Tooltip} {
    flex-shrink: 0;
    margin-right: ${spacing(3)};
    position: absolute;
  }

  ${media.lessThan('md')`
    min-width: 0;

    ${Tooltip} {
      top: ${spacing(3)};
      right: 0;
    }
  `};
`;

export const titleText = styled.div<TableRowProps>`
  width: ${({ locked }) => (locked ? 'calc(100% - 36px)' : '100%')};
  overflow: hidden;
  margin-left: ${({ locked }) => (locked ? '36px' : '0')};

  p {
    display: block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 1;
    width: 100%;
  }

  ${media.lessThan('md')`
    margin-bottom: ${spacing(1)};
    margin-left: 0;

    p {
      white-space: normal;
    }
  `};
`;

export const tableStatus = styled.div`
  width: 180px;
`;

export const mobileStatus = styled.div`
  display: inline-block;
  margin-bottom: ${spacing(3)};
`;

export const tableStats = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  white-space: nowrap;

  > div,
  > span {
    margin-left: ${spacing(4)};
    white-space: nowrap;
  }

  ${media.lessThan('md')`
    display: block;
    
    > div,
    > span {
      margin-left: 0;
      white-space: nowrap;
    }
  `};
`;

export const mobileActions = styled.div`
  width: 100%;
  display: flex !important;

  > div {
    width: calc(50% - 2px);

    &:first-child {
      margin-right: ${spacing(1)};
    }
  }
`;
