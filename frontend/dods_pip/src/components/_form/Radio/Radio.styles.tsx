import styled from 'styled-components';

import color from '../../../globals/color';
import spacing from '../../../globals/spacing';
import { hexAToRGBA } from '../../../utils/color';
import { radioTheme } from './index';

const THEME: Record<radioTheme, Record<string, any>> = {
  dark: {
    colourDefault: color.theme.blueMid,
    colourHover: color.theme.blueDark,
    colourDisabled: color.base.grey,
    colourLabelDisabled: color.base.greyDark,
    opacityDefault: 0.08,
    opacityFocused: 0.2,
  },
  light: {
    colourDefault: color.base.white,
    colourHover: color.base.white,
    colourDisabled: color.base.grey,
    colourLabelDisabled: color.base.greyDark,
    opacityDefault: 0.18,
    opacityFocused: 0.28,
  },
};

const RADIO_SIZE = 24;
const RADIO_CHECK_SIZE = 16;
const RADIO_CHECK_OFFSET = 3;

export const Radio = styled.label.attrs((props) => ({
  theme: THEME[props.theme as radioTheme],
}))`
  ${({ theme }) => `
  display: block;
  position: relative;
  min-height: ${RADIO_SIZE};
  padding-left: ${spacing(9)};
  cursor: pointer;
  user-select: none;

  &:hover .radio-button {
    border-color: ${theme.colourDefault};
    background-color: ${hexAToRGBA(theme.colourDefault, theme.opacityDefault)};

    &::after {
      background-color: ${theme.colourHover};
    }
  }

  .radio-button {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: ${RADIO_SIZE}px;
    width: ${RADIO_SIZE}px;
    border-radius: 50%;
    border: 1px solid ${theme.colourDefault};

    &::after {
      content: '';
      position: absolute;
      display: none;
      top: ${RADIO_CHECK_OFFSET}px;
      left: ${RADIO_CHECK_OFFSET}px;
      width: ${RADIO_CHECK_SIZE}px;
      height: ${RADIO_CHECK_SIZE}px;
      border-radius: 50%;
      background-color: ${theme.colourDefault};
    }
  }

  .label {
    font-size: 16px;
    line-height: 1.37;
    display: block;
    margin-top: ${RADIO_CHECK_OFFSET}px;
    color: ${theme.colourHover};
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked {
      ~ .radio-button {
        &::after {
          display: block;
        }
      }

      ~ .label {
        font-weight: 700;
      }
    }

    &:focus ~ .radio-button {
      background-color: ${hexAToRGBA(theme.colourDefault, theme.opacityFocused)};
      box-shadow: 0 0 0 4px ${hexAToRGBA(theme.colourDefault, theme.opacityFocused)};
    }

    &[disabled] {
      ~ .radio-button {
        border-color: ${theme.colourDisabled};
        background-color: ${hexAToRGBA(theme.colourDisabled, theme.opacityDefault)};

        &::after {
          background-color: ${theme.colourDisabled};
        }
      }

      ~ .label {
        color: ${theme.colourTextDisabled};
      }
    }
  }
`}
`;
