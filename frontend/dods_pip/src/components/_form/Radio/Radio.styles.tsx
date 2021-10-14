import styled from 'styled-components';

import color from '../../../globals/color';
import opacity from '../../../globals/opacity';
import spacing from '../../../globals/spacing';
import { hexAToRGBA } from '../../../utils/color';

const COLOUR_DEFAULT = color.theme.blueMid;
const COLOUR_HOVER = color.theme.blueDark;
const COLOUR_DISABLED = color.base.grey;
const COLOUR_LABEL_DISABLED = color.base.greyDark;

const RADIO_SIZE = 24;
const RADIO_CHECK_SIZE = 16;
const RADIO_CHECK_OFFSET = 3;

export const radio = styled.label`
  display: block;
  position: relative;
  min-height: ${RADIO_SIZE};
  padding-left: ${spacing(9)};
  cursor: pointer;
  user-select: none;

  &:hover .radio-button {
    border-color: ${COLOUR_HOVER};
    background-color: ${hexAToRGBA(COLOUR_DEFAULT, 0.08)};

    &::after {
      background-color: ${COLOUR_HOVER};
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
    border: 1px solid ${COLOUR_DEFAULT};

    &::after {
      content: '';
      position: absolute;
      display: none;
      top: ${RADIO_CHECK_OFFSET}px;
      left: ${RADIO_CHECK_OFFSET}px;
      width: ${RADIO_CHECK_SIZE}px;
      height: ${RADIO_CHECK_SIZE}px;
      border-radius: 50%;
      background-color: ${COLOUR_DEFAULT};
    }
  }

  .label {
    font-size: 16px;
    line-height: 1.37;
    display: block;
    margin-top: ${RADIO_CHECK_OFFSET}px;
    color: ${COLOUR_HOVER};
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
      background-color: ${hexAToRGBA(COLOUR_DEFAULT, 0.2)};
      box-shadow: 0 0 0 4px ${hexAToRGBA(COLOUR_DEFAULT, 0.2)};
    }

    &[disabled] {
      ~ .radio-button {
        border-color: ${COLOUR_DISABLED};
        background-color: ${hexAToRGBA(COLOUR_DISABLED, 0.08)};

        &::after {
          background-color: ${COLOUR_DISABLED};
        }
      }

      ~ .label {
        color: ${COLOUR_LABEL_DISABLED};
      }
    }
  }
`;
