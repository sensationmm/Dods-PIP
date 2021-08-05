import styled from 'styled-components';
import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import { hexAToRGBA } from '../../../utils/color';

export const wrapper = styled.div`
  position: relative;
  outline: 0;

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
  cursor: pointer;
  position: relative;
  width: 48px;
  height: 24px;
  background: ${color.base.grey};
  border-radius: 12px;

  &:hover {
    background: ${color.shadow.grey};
  }

  &.disabled {
    background: ${color.base.grey};
    opacity: ${opacity.mid};
    pointer-events: none;
    cursor: not-allowed;
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
