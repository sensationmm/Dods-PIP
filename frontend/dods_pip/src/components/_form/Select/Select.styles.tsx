import styled from 'styled-components';

import color from '../../../globals/color';
import elevation from '../../../globals/elevation';
import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  position: relative;
  width: 100%;
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
`;

type DropdownProps = {
  open: boolean;
};

export const dropdown = styled.div<DropdownProps>`
  display: ${(p) => (p.open ? 'block' : 'none')};
  position: absolute;
  margin-top: -8px;
  padding-top: 8px;
  width: 100%;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  box-shadow: ${elevation.dropShadow1};
  background: ${color.shadow.blue};

  &:before {
    content: '';
    position: absolute;
    top: 8px;
    width: 100%;
    height: 2px;
    background: ${color.theme.blueMid};
  }
`;

type DropdownItemProps = {
  size: 'small' | 'medium' | 'large';
};

export const dropdownItem = styled.div<DropdownItemProps>`
  color: ${color.theme.blueMid};
  background: ${color.shadow.blue};
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
