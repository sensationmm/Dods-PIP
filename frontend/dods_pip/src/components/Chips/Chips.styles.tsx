import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';
import { ChipsSize } from '.';

type WrapperProps = {
  selected?: boolean;
  disabled?: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  display: inline-block;
  border: 1px solid ${color.shadow.grey};
  background: ${({ selected, disabled }) =>
    disabled ? color.base.ivory : selected ? color.shadow.blue : color.base.white};
  color: ${({ disabled }) => disabled && color.base.grey};
  border-radius: 60px;
  padding: 4px 8px 4px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: ${({ disabled, selected }) =>
      disabled ? color.base.ivory : selected ? color.shadow.blue : color.shadow.blue};
  }
`;

export const avatarWrapper = styled.div`
  margin-right: ${spacing(2)};
`;

export const contentWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

type CloseButtonProps = {
  disabled?: boolean;
  selected?: boolean;
};

export const closeButton = styled.div<CloseButtonProps>`
  display: ${({ selected }) => (selected ? 'inline' : 'none')};
  padding: ${spacing(1.5)};
  border-radius: 50%;
  background: ${({ disabled }) => (disabled ? color.base.grey : color.theme.blueMid)};
  margin-left: ${spacing(2)};
`;

type IconWrapperType = {
  size: ChipsSize;
  hovering?: boolean;
  disabled?: boolean;
  selected?: boolean;
};

export const iconWrapper = styled.div<IconWrapperType>`
  margin-right: ${spacing(2)};
  width: ${({ size }) => (size === 'medium' ? spacing(8) : spacing(6))};
  height: ${({ size }) => (size === 'medium' ? spacing(8) : spacing(6))};
  border-radius: 50%;
  background: ${({ hovering, selected, disabled }) =>
    disabled ? color.shadow.grey : hovering || selected ? color.base.white : color.shadow.blue};
  display: flex;
  justify-content: center;
  align-items: center;
`;
