import styled from 'styled-components';

import color from '../../../globals/color';
import { InputSize } from '.';

interface NumberPickerStyleProps {
  size?: InputSize;
  isDisabled?: boolean;
  hasError?: boolean;
}

const BORDER_RADIUS = '8px';

const THEME = {
  small: {
    containerWidth: '116px',
    iconButtonSize: '32px',
  },
  medium: {
    containerWidth: '132px',
    iconButtonSize: '40px',
  },
  large: {
    containerWidth: '148px',
    iconButtonSize: '48px',
  },
  standard: {
    iconButtonBg: color.shadow.blue,
    iconButtonColor: color.base.grey,
    inputBg: color.base.white,
    inputColor: color.theme.blue,
  },
  disabled: {
    iconButtonBg: color.base.greyMid,
    iconButtonColor: color.base.greyDark,
    inputBg: color.base.greyLight,
    inputColor: color.base.greyDark,
  },
  error: {
    iconButtonBg: color.alert.red,
    iconButtonColor: color.base.white,
    inputBg: color.shadow.red,
    inputColor: color.alert.red,
  },
};

export const numberPicker = styled.div.attrs(
  ({ size, isDisabled, hasError }: NumberPickerStyleProps) => {
    let colors = THEME.standard;
    if (hasError) colors = THEME.error;
    if (isDisabled) colors = THEME.disabled;

    const sizes = THEME[size as InputSize];
    return {
      sizes,
      colors,
      size,
      isDisabled,
      hasError,
    };
  },
)`
  width: ${({ sizes }) => sizes.containerWidth};
  display: flex;
  border-radius: ${BORDER_RADIUS};
  background-color: ${({ colors }) => colors.inputBg};
  color: ${({ colors }) => colors.inputColor};

  .icon-button {
    padding: 0;
    border: none;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: ${({ sizes }) => sizes.iconButtonSize};
    height: ${({ sizes }) => sizes.iconButtonSize};
    border-radius: ${BORDER_RADIUS};
    background-color: ${({ colors }) => colors.iconButtonBg};
    cursor: pointer;
    outline: 0;

    &[disabled] {
      cursor: not-allowed;

      & > * {
        color: ${THEME.disabled.iconButtonColor};
      }
    }

    & > * {
      color: ${({ colors }) => colors.iconButtonColor} !important;
      margin: auto;
    }

    ${({ hasError }) =>
      !hasError &&
      `
        &:not([disabled]):hover,
        &:not([disabled]):focus {
          & > * {
            color: ${color.theme.blue} !important;
          }
        }
    `}
  }

  input[type='number'] {
    border: 0;
    outline: 0;
    min-width: 0;
    text-align: center;
    font-size: 16px;
    background: transparent;
    color: currentColor;
  }
`;
