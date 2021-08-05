import styled from 'styled-components';
import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import { hexAToRGBA } from '../../../utils/color';

export const wrapper = styled.div``;

export const checkbox = styled.div`
  cursor: pointer;
`;

export const checkboxLayout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const checkboxToggle = styled.div`
  position: relative;
  border: 1px solid ${color.theme.blueMid};
  border-radius: 4px;
  width: 22px;
  height: 22px;
  margin-right: 10px;
  background: ${color.base.white};
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 0;

  &:hover {
    border-color: ${color.theme.blue};
    background: ${color.shadow.blue};
  }

  &.disabled {
    border-color: ${color.base.grey};
    pointer-events: none;
  }

  &:focus::before {
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    top: -5px;
    left: -5px;
    background: ${hexAToRGBA(color.theme.blueMid, opacity.high)};
    border-radius: 8px;
  }
`;

export const checkboxToggleChecked = styled(checkboxToggle)`
  background: ${color.theme.blueMid};

  &:hover {
    background: ${color.theme.blue};
  }

  &.disabled {
    border-color: ${color.base.grey};
    background: ${color.base.grey};
    pointer-events: none;
  }
`;

export const checkboxLabel = styled.label`
  &.disabled {
    color: var(--color-grey-mid);
  }

  a {
    color: var(--color-brand-main);
    text-decoration: underline;
  }
`;
