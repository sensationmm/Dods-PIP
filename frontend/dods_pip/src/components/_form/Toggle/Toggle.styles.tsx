import styled from 'styled-components';

import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import spacing from '../../../globals/spacing';
import { hexAToRGBA } from '../../../utils/color';

type WrapperProps = {
  disabled: boolean;
  hasOnLabel: boolean;
  hasOffLabel: boolean;
  small: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  position: relative;
  outline: 0;
  display: grid;
  grid-template-columns: ${({ hasOffLabel, hasOnLabel, small }) =>
    hasOnLabel && hasOffLabel
      ? small
        ? '1fr 32px 1fr'
        : '1fr 48px 1fr'
      : hasOnLabel
      ? small
        ? '1fr 32px'
        : '1fr 48px'
      : hasOffLabel
      ? small
        ? '32px 1fr'
        : '48px 1fr'
      : small
      ? '32px'
      : '48px'};
  column-gap: ${spacing(3)};
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  p:first-of-type {
    text-align: right !important;
  }

  p {
    white-space: nowrap;
  }
`;

type ToggleProps = {
  small: boolean;
};

export const control = styled.div<ToggleProps>`
  position: absolute;
  top: ${({ small }) => (small ? '3px' : '2px')};
  left: ${({ small }) => (small ? '3px' : '2px')};
  width: ${({ small }) => (small ? '10px' : '20px')};
  height: ${({ small }) => (small ? '10px' : '20px')};
  background: ${color.base.white};
  border-radius: 11px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;

  svg {
    display: block;
  }
`;

export const toggle = styled.div<ToggleProps>`
  position: relative;
  width: ${({ small }) => (small ? '32px' : '48px')};
  height: ${({ small }) => (small ? '16px' : '24px')};
  background: ${color.base.greyMid};
  border-radius: 12px;

  &:hover {
    background: ${color.theme.blueMid};
  }

  &.disabled {
    background: ${color.base.greyMid};
    pointer-events: none;

    ${control} {
      background: ${color.base.greyDark};
    }
  }

  &:focus::before {
    content: '';
    position: absolute;
    width: ${({ small }) => (small ? '36px' : '56px')};
    height: ${({ small }) => (small ? '20px' : '32px')};
    top: ${({ small }) => (small ? '-2px' : '-4px')};
    left: ${({ small }) => (small ? '-2px' : '-4px')};
    background: ${hexAToRGBA(color.theme.blueMid, opacity.high)};
    border-radius: ${({ small }) => (small ? '12px' : '16px')};
  }
`;

export const toggleActive = styled(toggle)<ToggleProps>`
  background: ${color.theme.blueMid};

  &:hover {
    background: ${color.theme.blue};
  }

  ${control} {
    left: auto;
    right: ${({ small }) => (small ? '3px' : '2px')};
  }
`;
