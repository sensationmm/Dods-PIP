import styled from 'styled-components';

import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import spacing from '../../../globals/spacing';
import { hexAToRGBA } from '../../../utils/color';

export const checkbox = styled.div`
  cursor: pointer;
`;

export const checkboxLayout = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

type CheckboxToggleProps = {
  darkMode?: boolean;
};

export const checkboxToggle = styled.div<CheckboxToggleProps>`
  position: relative;
  border: 1px solid ${({ darkMode }) => (darkMode ? color.base.white : color.theme.blueMid)};
  border-radius: 4px;
  width: 24px;
  height: 24px;
  margin-right: ${spacing(3)};
  background: ${color.base.transparent};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus-visible {
    outline: none;
  }

  &:hover::before {
    outline: none;
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    top: -5px;
    left: -5px;
    background: ${({ darkMode }) =>
      !darkMode
        ? hexAToRGBA(color.theme.blueMid, opacity.high)
        : hexAToRGBA(color.base.greyDark, opacity.high)};
    border-radius: 8px;
    z-index: -2;
  }
  &:focus::before,
  &:active::before {
    outline: none;
    content: '';
    position: absolute;
    width: 32px;
    height: 32px;
    top: -5px;
    left: -5px;
    background: ${({ darkMode }) =>
      !darkMode
        ? hexAToRGBA(color.theme.blueMid, opacity.mid)
        : hexAToRGBA(color.base.greyDark, opacity.mid)};
    border-radius: 8px;
    z-index: -2;
  }

  &.disabled {
    border-color: ${color.base.grey};
    pointer-events: none;
  }
`;

export const checkboxToggleChecked = styled(checkboxToggle)`
  background: ${({ darkMode }) => (darkMode ? color.base.white : color.theme.blueMid)};

  ${({ darkMode }) =>
    darkMode
      ? `
      &:hover::before {
        outline: none;
        content: '';
        position: absolute;
        width: 32px;
        height: 32px;
        top: -5px;
        left: -5px;
        background:  ${hexAToRGBA(color.base.white, opacity.high)}; 
        border-radius: 8px;
        z-index: -2;
      }

      &:focus::before,
      &:active::before {
        outline: none;
        content: '';
        position: absolute;
        width: 32px;
        height: 32px;
        top: -5px;
        left: -5px;
        background:  ${hexAToRGBA(color.base.white, opacity.mid)}; 
        border-radius: 8px;
        z-index: -2;
      }
    `
      : `
    &:hover {
      background: ${color.theme.blue};
    }
    `};

  &.disabled {
    border-color: ${color.base.grey};
    background: ${color.base.grey};
    pointer-events: none;
  }
`;

export const checkboxLabelWrapper = styled.div`
  &.disabled {
    color: var(--color-grey-mid);
  }

  a {
    color: var(--color-brand-main);
    text-decoration: underline;
  }
`;
