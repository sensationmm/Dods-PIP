import styled from 'styled-components';

import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import spacing from '../../../globals/spacing';
import { hexAToRGBA } from '../../../utils/color';

type WrapperProps = {
  disabled: boolean;
};

export const wrapper = styled.div<WrapperProps>`
  position: relative;
  outline: 0;
  display: grid;
  grid-template-columns: 1fr 48px 1fr;
  column-gap: ${spacing(3)};
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  p:first-of-type {
    text-align: right !important;
  }
`;

export const control = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
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

export const toggle = styled.div`
  position: relative;
  width: 48px;
  height: 24px;
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
    width: 56px;
    height: 32px;
    top: -4px;
    left: -4px;
    background: ${hexAToRGBA(color.theme.blueMid, opacity.high)};
    border-radius: 16px;
  }
`;

export const toggleActive = styled(toggle)`
  background: ${color.theme.blueMid};

  &:hover {
    background: ${color.theme.blue};
  }

  ${control} {
    left: auto;
    right: 2px;
  }
`;
