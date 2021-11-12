import styled from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import spacing from '../../globals/spacing';
import { hexAToRGBA } from '../../utils/color';
import { wrapper as Toggle } from '../_form/Toggle/Toggle.styles';
import { wrapper as Button } from '../Button/Button.styles';
import { Icon } from '../Icon/Icon.styles';

type WrapperProps = {
  collapsed: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  width: ${({ collapsed }) => (collapsed ? '160px' : '350px')};
  display: ${({ collapsed }) => (collapsed ? 'flex' : 'block')};
`;

type BoxProps = {
  tags: boolean;
};

export const box = styled.div<BoxProps>`
  position: relative;
  background: ${color.base.white};
  border-radius: ${spacing(2)};
  box-shadow: ${elevation.dropShadow2};
  width: 100%;
  padding: 0;
  height: ${({ tags }) => (tags ? '60vh' : 'auto')};
  overflow: ${({ tags }) => (tags ? 'scroll' : 'auto')}; ;
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

export const content = styled.div`
  padding: ${spacing(4)} ${spacing(6)};
  height: calc(80vh - 120px);
  overflow: auto;
`;

export const instructions = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const search = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing(4)} ${spacing(6)};
  cursor: pointer;
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

type TagPanelProps = {
  disabled: boolean;
};

export const tagPanel = styled.div<TagPanelProps>`
  position: relative;

  &::after {
    content: ${({ disabled }) => (disabled ? "''" : undefined)};
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: ${hexAToRGBA(color.base.white, 0.4)};
  }
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
`;

export const browser = styled.div`
  position: relative;
  width: 100%;
  max-width: 80%;
  display: grid;
  grid-template-columns: 1fr 350px;
  column-gap: ${spacing(5)};
  height: 80vh;

  > ${Icon} {
    margin-right: ${spacing(5)};
  }
`;

export const browserActions = styled.div`
  padding: ${spacing(4)} ${spacing(6)};
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
};

export const tab = styled.div<TabProps>`
  flex-grow: 1;
  padding-bottom: ${spacing(2)};
  border-bottom: 4px solid ${({ active }) => (active ? color.theme.blueLight : 'transparent')};
  cursor: pointer;
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

type TagTreeChildrenProps = {
  open: boolean;
};

export const tagTreeChildren = styled.div<TagTreeChildrenProps>`
  display: ${({ open }) => (open ? 'block' : 'none')};
  padding-left: 35px;
`;

export const tabContent = styled.div`
  height: calc(80vh - 188px);
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
