import styled from 'styled-components';

import color from '../../../globals/color';
import elevation from '../../../globals/elevation';
import opacity from '../../../globals/opacity';
import spacing from '../../../globals/spacing';
import { hexAToRGBA } from '../../../utils/color';
import { input as Input, wrapper as InputText } from '../InputBase/InputBase.styles';

type WrapperProps = {
  hasSelected: boolean;
  hasError: boolean;
  isDisabled: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  position: relative;
  width: 100%;
  box-sizing: content-box;

  ${InputText} {
    z-index: 1;

    ${Input} {
      padding-left: ${({ hasSelected }) => (hasSelected ? spacing(12) : spacing(3))};
    }
  }

  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};

  &:hover {
    ${Input} {
      margin-bottom: 1px;
      border-bottom: 1px solid
        ${({ hasError }) => (hasError ? color.alert.red : color.theme.blueMid)};
      border-radius: 8px 8px 0 0;
    }
  }
`;

export const select = styled.div`
  position: relative;
`;

export const selectTrigger = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

type DropdownProps = {
  open: boolean;
  hasHelper: boolean;
  hasError: boolean;
};

export const dropdown = styled.div<DropdownProps>`
  display: ${(p) => (p.open ? 'block' : 'none')};
  position: absolute;
  margin-top: ${(p) => (p.hasHelper || p.hasError ? '-35px' : '-8px')};
  padding-top: 8px;
  width: 100%;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  box-shadow: ${elevation.selectShadow};
  background: ${(p) => (p.hasError ? color.shadow.red : color.shadow.blue)};
  z-index: 2;

  &:before {
    content: '';
    position: absolute;
    top: 8px;
    width: 100%;
    height: 2px;
    background: ${(p) => (p.hasError ? color.alert.red : color.theme.blueMid)};
  }
`;

type checkboxToggleProps = {
  hasError: boolean;
};

export const checkboxToggle = styled.div<checkboxToggleProps>`
  position: relative;
  border: 1px solid ${({ hasError }) => (hasError ? color.alert.red : color.theme.blueMid)};
  border-radius: 4px;
  width: 16px;
  height: 16px;
  margin-right: ${spacing(3)};
  background: ${color.shadow.blue};
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;

  &:hover {
    border-color: ${({ hasError }) => (hasError ? color.alert.red : color.theme.blueMid)};
    background: ${({ hasError }) => (hasError ? color.shadow.red : color.shadow.blue)};
  }
`;

export const checkboxToggleChecked = styled(checkboxToggle)`
  background: ${({ hasError }) => (hasError ? color.alert.red : color.theme.blueMid)} !important;
`;

type DropdownItemProps = {
  size: 'small' | 'medium' | 'large';
  hasError: boolean;
  active: boolean;
};

export const dropdownItem = styled.div<DropdownItemProps>`
  color: ${({ hasError, active }) =>
    active ? color.base.grey : hasError ? color.alert.red : color.theme.blueMid};
  background: ${({ hasError }) => (hasError ? color.shadow.red : color.shadow.blue)};
  padding: ${(p) =>
    p.size === 'large'
      ? spacing(3)
      : p.size === 'medium'
      ? `${spacing(2)} ${spacing(3)}`
      : `${spacing(1)} ${spacing(3)}`};
  font-family: 'Open Sans';
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid ${({ hasError }) => (hasError ? color.shadow.red : color.shadow.blue)};

  &:hover {
    background: ${color.base.white};

    ${checkboxToggle}::before {
      content: '';
      position: absolute;
      width: 22px;
      height: 22px;
      top: -4px;
      left: -4px;
      background: ${hexAToRGBA(color.theme.blueMid, opacity.high)};
      border-radius: 6px;
    }
  }

  &:focus {
    border-color: ${color.theme.blueMid};
    outline: 0;

    ${checkboxToggle} {
      background: ${color.base.greyLight};
    }
  }

  &:last-of-type {
    border-radius: 0 0 8px 8px;
  }
`;

export const pip = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${spacing(3)};
  background: ${color.base.white};
`;
