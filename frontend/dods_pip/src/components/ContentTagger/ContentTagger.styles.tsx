import styled from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import spacing from '../../globals/spacing';
import { wrapper as Box } from '../_layout/Box/Box.styles';
import { wrapper as Button } from '../Button/Button.styles';
import { Icon } from '../Icon/Icon.styles';
import { checkbox } from '../_form/Checkbox/Checkbox.styles';
import { hexAToRGBA } from '../../utils/color';

type WrapperProps = {
  collapsed: boolean;
};

export const wrapper = styled(Box)<WrapperProps>`
  width: ${({ collapsed }) => (collapsed ? '160px' : '350px')};
  height: 60vh;
  padding: 0;
  display: ${({ collapsed }) => (collapsed ? 'flex' : 'block')};
  justify-content: center;
  align-items: center;
  overflow: scroll;
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
  border-bottom: 1px solid ${color.base.greyLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const headerText = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  ${Icon} {
    margin-right: ${spacing(2)};
  }
`;

export const expand = styled(headerText)`
  cursor: pointer;
`;

export const content = styled.div`
  padding: ${spacing(4)} ${spacing(6)};
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

export const browse = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;

  > ${Icon} {
    margin-right: ${spacing(2)};
  }
`;

type BrowserProps = {
  hasChanges: boolean;
};

export const browser = styled.div<BrowserProps>`
  position: relative;
  background: ${color.base.greyLighter};
  border: 1px solid ${color.base.greyLight};
  border-radius: 8px;
  padding: ${spacing(2)};
  padding-bottom: ${({ hasChanges }) => (hasChanges ? '60px' : spacing(2))};

  ${checkbox} {
    margin-bottom: ${spacing(2)};

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

export const actions = styled.div`
  width: calc(100% - ${spacing(4)});
  background: ${color.base.white};
  border-radius: 8px;
  box-shadow: ${elevation.notification};
  padding: ${spacing(2)};
  display: flex;
  position: absolute;
  bottom: ${spacing(2)};

  ${Button} {
    width: calc(50% - ${spacing(1)});

    &:first-child {
      margin-right: ${spacing(2)};
    }
  }
`;
