import styled from 'styled-components';

import color from '../../../globals/color';
import elevation from '../../../globals/elevation';
import spacing from '../../../globals/spacing';
import { wrapper as InputText } from '../InputBase/InputBase.styles';

export const wrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: content-box;

  ${InputText} {
    z-index: 1;
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
};

export const dropdownItem = styled.div<DropdownItemProps>`
  color: ${(p) => (p.hasError ? color.alert.red : color.theme.blueMid)};
  background: ${(p) => (p.hasError ? color.shadow.red : color.shadow.blue)};
  padding: ${(p) =>
    p.size === 'large'
      ? spacing(3)
      : p.size === 'medium'
      ? `${spacing(2)} ${spacing(3)}`
      : `${spacing(1)} ${spacing(3)}`};
  font-family: 'Open Sans';
  font-size: 16px;

  &:hover {
    background: ${color.base.white};
  }
`;
