import { wrapper as Select } from '@dods-ui/components/_form/Select/Select.styles';
import styled from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import spacing from '../../globals/spacing';
import { hexAToRGBA } from '../../utils/color';
import { checkbox as Checkbox } from '../_form/Checkbox/Checkbox.styles';
import { label as Label } from '../_form/Label/Label.styles';
import { wrapper as Toggle } from '../_form/Toggle/Toggle.styles';
import { text as ButtonText, wrapper as Button } from '../Button/Button.styles';
import { Icon } from '../Icon/Icon.styles';

type WrapperProps = {
  collapsed: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  width: ${({ collapsed }) => (collapsed ? '160px' : '350px')};
  height: 70vh;
  display: ${({ collapsed }) => (collapsed ? 'flex' : 'block')};
  position: relative;
`;

type BoxProps = {
  tags: boolean;
  hasOperator?: boolean;
};

export const box = styled.div<BoxProps>`
  position: relative;
  background: ${color.base.white};
  border-radius: ${spacing(2)};
  box-shadow: ${elevation.dropShadow2};
  width: 100%;
  padding: 0;
  height: ${({ tags }) => (tags ? 'calc(70vh - 92px)' : 'auto')};
  overflow: ${({ hasOperator = false, tags }) =>
    hasOperator ? 'visible' : tags ? 'scroll' : 'auto'}; ;
`;

export const collapsed = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > div {
    margin-bottom: ${spacing(4)};
  }
`;

export const header = styled.div`
  padding: ${spacing(4)} ${spacing(6)};
  // border-bottom: 1px solid ${color.base.greyLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const headerText = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  > ${Icon} {
    margin-right: ${spacing(2)};
  }
`;

export const expand = styled(headerText)`
  cursor: pointer;
`;

export const contentPadded = styled.div`
  padding: ${spacing(4)} ${spacing(6)};
`;

type ContentProps = {
  hasOperator?: boolean;
};
export const content = styled(contentPadded)<ContentProps>`
  height: ${({ hasOperator = false }) =>
    hasOperator ? 'calc(80vh - 160px)' : 'calc(80vh - 120px)'};
  overflow: auto;
`;

export const instructions = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const searchButton = styled.div`
  border: 1px solid ${color.base.greyLight};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  box-shadow: ${elevation.dropShadow2};
`;

export const inProgress = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: ${color.alert.orange};
  display: flex;
  justify-content: center;
  align-items: center;
`;

type SearchProps = {
  inProgress: boolean;
};

export const search = styled.div<SearchProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing(4)} ${spacing(6)};
  cursor: pointer;

  ${searchButton} {
    display: ${({ inProgress }) => (inProgress ? 'none' : 'flex')};
  }

  ${inProgress} {
    display: ${({ inProgress }) => (inProgress ? 'flex' : 'none')};
  }

  &:hover {
    ${searchButton} {
      display: flex;
    }
    ${inProgress} {
      display: none;
    }
  }
`;

export const tagPanel = styled.div`
  position: relative;
`;

export const tagPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type TagPanelStateProps = {
  open: boolean;
};

export const tagPanelHeaderText = styled.div<TagPanelStateProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  > ${Icon} {
    margin-right: ${spacing(2)};
    transform: rotate(${({ open }) => (open ? '0deg' : '180deg')});
    transition: transform linear 0.2s;
  }
`;

export const tagPanelContent = styled.div<TagPanelStateProps>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  padding-top: ${spacing(2)};
`;

export const tag = styled.div`
  display: inline-block;
  margin: 0 ${spacing(1)} ${spacing(1)} 0;
`;

export const browserWindow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${hexAToRGBA(color.theme.blueDark, 0.5)};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

type BrowserProps = {
  hasHighlight: boolean;
};
export const browser = styled.div<BrowserProps>`
  position: relative;
  width: 100%;
  max-width: 80%;
  display: grid;
  grid-template-columns: ${({ hasHighlight }) => (!hasHighlight ? '1fr 350px' : '1fr')};
  column-gap: ${spacing(5)};
  height: 80vh;

  > ${Icon} {
    margin-right: ${spacing(5)};
  }
`;

export const browserActions = styled.div`
  padding: ${spacing(4)} ${spacing(6)};
`;

export const operator = styled.div`
  background: ${color.base.greyLighter};
  border: 1px solid ${color.base.greyLight};
  border-radius: 8px;
  padding: ${spacing(1)};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${spacing(1)};
  white-space: nowrap;

  ${Select} {
    width: 80px;
    margin-left: ${spacing(3)};
  }
`;

export const toggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  ${Toggle} {
    margin-left: ${spacing(3)};
    margin-right: ${spacing(3)};
  }
`;

export const tabs = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  position: relative;
  z-index: 2;
`;

type TabProps = {
  active: boolean;
  disabled: boolean;
};

export const tab = styled.div<TabProps>`
  flex-grow: 1;
  padding-bottom: ${spacing(2)};
  border-bottom: 4px solid
    ${({ active, disabled }) => (active && !disabled ? color.theme.blueLight : 'transparent')};
  cursor: pointer;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;

export const tagTreeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const tagTree = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: ${spacing(2)} 0;
`;

export const tagTreeToggle = styled.div`
  margin-left: ${spacing(2)};
`;

export const tagTreeChildren = styled.div`
  display: block;
  padding-left: 35px;
`;

export const tagSearch = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-column-gap: ${spacing(5)};
  grid-row-gap: ${spacing(5)};

  > div {
    position: relative;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      height: 1px;
      width: 105%;
      bottom: -${spacing(2.5)};
      background: ${color.base.greyLight};
    }

    &:nth-child(2n) {
      &:after {
        left: -5%;
      }
    }
  }

  > ${Checkbox} {
    flex-shrink: 0;
  }

  > p:first-of-type {
    padding-left: 36px;
  }
`;

export const searchCheckbox = styled.div`
  display: flex;
  align-items: center;

  ${Label} {
    margin: 0;
  }
`;

export const highlight = styled.div`
  display: flex;

  > p:first-of-type {
    margin-right: ${spacing(1)};
  }
`;

type TabContentProps = {
  isSearch?: boolean;
};

export const multipleWarningInfo = styled.div`
  padding: ${spacing(2)};
  background: ${color.shadow.grey};
  border-radius: 8px;
`;

export const autoTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    flex-shrink: 0;
  }
`;

export const autoTagButtons = styled.div`
  display: flex;

  ${ButtonText} {
    padding: 0 ${spacing(2)} 0 36px !important;
  }
`;

export const tabContent = styled.div<TabContentProps>`
  height: ${({ isSearch = false }) => (isSearch ? `calc(80vh - 321px)` : `calc(80vh - 188px)`)};
  overflow: auto;
  padding: ${spacing(5)} ${spacing(8)} 50px ${spacing(8)};
  background: ${color.base.greyLighter};
  position: relative;
  z-index: 1;
  top: -2px;
  border-top: 1px solid ${color.base.greyMid};

  > ${tagTreeChildren} {
    border-top: 1px solid ${color.base.greyLight};
    border-bottom: 1px solid ${color.base.greyLight};
  }
`;

export const tabContentMask = styled.div`
  position: relative;

  &:before {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    content: '';
    background: linear-gradient(transparent, ${color.base.greyLight});
  }
`;

export const actions = styled.div`
  padding: ${spacing(4)} ${spacing(6)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const actionsButton = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  > ${Button} {
    margin-left: ${spacing(5)};
  }
`;

export const controls = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  right: 0;
  z-index: 2;
  background: ${color.base.greyLight};
  padding: ${spacing(2)};
  border-radius: 0 0 0 8px;

  > div:first-child {
    margin-right: ${spacing(2)};

    &:last-child {
      margin-right: 0;
    }
  }
`;

export const counter = styled.div`
  border-radius: 4px;
  background: ${color.theme.blueLight};
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const closeWarning = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  background: ${color.base.white};
  padding: ${spacing(4)} ${spacing(6)};
  border-radius: 8px;
  overflow: hidden;

  ${actions} {
    padding: 0;
  }
`;

export const closeWarningAlert = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: ${color.alert.orange};
  margin-right: ${spacing(4)};
`;

export const closeWarningText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100% - 56px);
`;

export const clear = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: ${spacing(10)};
  background: ${hexAToRGBA(color.base.white, 0.8)};
`;
