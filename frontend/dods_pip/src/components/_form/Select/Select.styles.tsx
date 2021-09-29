import styled from 'styled-components';

import color from '../../../globals/color';
import elevation from '../../../globals/elevation';
import spacing from '../../../globals/spacing';
import { input as Input, wrapper as InputText } from '../InputBase/InputBase.styles';

type WrapperProps = {
  hasError: boolean;
  isDisabled: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  position: relative;
  width: 100%;
  box-sizing: content-box;

  ${InputText} {
    z-index: 1;
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
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${({ hasError }) => (hasError ? color.shadow.red : color.shadow.blue)};

  &:hover {
    background: ${color.base.white};
  }

  &:focus {
    border-color: ${color.theme.blueMid};
    outline: 0;
  }

  &:last-of-type {
    border-radius: 0 0 8px 8px;
  }
`;
