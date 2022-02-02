import styled from 'styled-components';

import color from '../../../globals/color';
import elevation from '../../../globals/elevation';
import spacing from '../../../globals/spacing';
import { wrapper as Avatar } from '../../Avatar/Avatar.styles';
import { input as Input, wrapper as InputText } from '../InputBase/InputBase.styles';

type WrapperProps = {
  hasError: boolean;
  isDisabled: boolean;
  isFullWidth: boolean;
  isFilter: boolean;
  inline: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  position: relative;
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : 'auto')};
  box-sizing: content-box;

  ${InputText} {
    z-index: 1;
    overflow: visible;
  }

  ${Input} {
    background: ${({ isDisabled, inline, hasError, isFilter }) =>
      isDisabled
        ? color.base.greyLight
        : inline
        ? 'transparent'
        : hasError
        ? color.shadow.red
        : isFilter
        ? color.base.white
        : color.shadow.blue};
    border: ${({ inline }) => (!inline ? `1px solid ${color.shadow.blue} !important` : 'none')};
    margin-bottom: 1px;
    ${({ inline }) => inline && 'padding: 0'};
  }

  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};

  &:hover {
    ${Input} {
      margin-bottom: 1px;
      border-bottom: 1px solid
        ${({ hasError }) => (hasError ? color.alert.red : color.theme.blueMid)} !important;
      border-radius: 8px 8px 0 0;
      ${({ inline }) => inline && 'border-bottom: 0 !important;'}
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
  isFilter: boolean;
  inline: boolean;
};

export const dropdown = styled.div<DropdownProps>`
  display: ${(p) => (p.open ? 'block' : 'none')};
  position: absolute;
  margin-top: ${(p) => (p.inline ? '0px' : p.hasHelper || p.hasError ? '-35px' : '-8px')};
  padding-top: 8px;
  width: 100%;
  max-height: 180px;
  overflow: auto;
  border-radius: 0 0 8px 8px;
  box-shadow: ${elevation.selectShadow};
  background: ${({ hasError, isFilter }) =>
    hasError ? color.shadow.red : isFilter ? color.base.white : color.shadow.blue};
  z-index: 100;

  &:before {
    content: ${({ inline }) => (!inline ? '' : null)};
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
  isFilter: boolean;
};

export const dropdownItem = styled.div<DropdownItemProps>`
  white-space: nowrap;
  color: ${({ hasError, active }) =>
    active ? color.base.grey : hasError ? color.alert.red : color.theme.blueMid};
  background: ${({ hasError, isFilter }) =>
    hasError ? color.shadow.red : isFilter ? color.base.white : color.shadow.blue};
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
  border: 1px solid
    ${({ hasError, isFilter }) =>
      hasError ? color.shadow.red : isFilter ? color.base.white : color.shadow.blue};
  margin-right: 0 !important;

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

export const dropdownItemTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  > ${Avatar} {
    margin-right: ${spacing(3)};
  }
`;
