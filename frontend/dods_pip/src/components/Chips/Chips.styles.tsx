import styled, { css, keyframes } from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';
import { ChipsSize } from '.';

type WrapperProps = {
  clickable?: boolean;
  disabled?: boolean;
  iconOrAvatar?: boolean;
  theme: string;
  flash: boolean;
};

const animFlash = keyframes`
  0% { background-color: ${color.shadow.blue}; }
  10% { background-color: ${color.shadow.yellow}; }
  80% { background-color: ${color.shadow.yellow}; }
  100% { background-color: ${color.shadow.blue}; }
`;

export const wrapper = styled.div<WrapperProps>`
  position: relative;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  display: inline-block;
  border: 1px solid ${color.base.greyLight};
  background: ${({ clickable, disabled, theme }) =>
    disabled
      ? color.base.ivory
      : clickable
      ? theme === 'light'
        ? color.base.white
        : color.shadow.blue
      : theme === 'light'
      ? color.shadow.blue
      : color.base.white};
  color: ${({ disabled }) => disabled && color.base.grey};
  border-radius: 60px;
  padding: ${({ iconOrAvatar }) => (iconOrAvatar ? '4px 8px 4px 4px' : '4px 8px 4px 8px')};
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${({ flash, clickable }) =>
    flash && clickable
      ? css`
          ${animFlash} 5000ms both;
        `
      : 'none'};
`;

export const avatarWrapper = styled.div`
  margin-right: ${spacing(2)};
`;

export const contentWrapper = styled.div`
  display: flex;
  align-items: center;
`;

type CloseButtonProps = {
  disabled?: boolean;
  hovering?: boolean;
};

export const closeButton = styled.div<CloseButtonProps>`
  display: ${({ hovering, disabled }) => (hovering ? 'block' : disabled ? 'block' : 'none')};
  position: absolute;
  right: 2px;
  padding: ${spacing(1.5)};
  border-radius: 50%;
  background: ${({ disabled }) => (disabled ? color.base.grey : color.theme.blue)};
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
  border: 1px solid ${color.base.greyLight};
  background: ${({ hovering, selected, disabled }) =>
    disabled ? color.shadow.grey : hovering || selected ? color.base.white : color.shadow.blue};
  display: flex;
  justify-content: center;
  align-items: center;
`;
