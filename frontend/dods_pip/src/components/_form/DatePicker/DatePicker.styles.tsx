import styled from 'styled-components';

import color from '../../../globals/color';
import elevation from '../../../globals/elevation';
import spacing from '../../../globals/spacing';

export const wrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: content-box;

  > div:nth-child(2) {
    position: absolute;
    top: calc(100% + ${spacing(3)});

    .react-datepicker {
      font-family: Open Sans;
      border: 0;
      box-shadow: ${elevation.dropShadow2};
      z-index: 100;

      &__navigation-icon {
        &::before {
          border-width: 2px 2px 0 0;
          width: 6px;
          height: 6px;
          top: 8px;
        }

        &--next::before,
        &--previous::before {
          left: -3px;
        }
      }

      &__current-month {
        color: ${color.theme.blue};
        font-family: Open Sans Bold;
        font-weight: bold;
        padding: ${spacing(2)} 0;
        font-size: 18px;
      }

      &__navigation {
        background: ${color.theme.blueMid};
        border-radius: 8px;
        width: 30px;
        height: 30px;
        top: 15px;

        &--next {
          right: 15px;
        }

        &--previous {
          left: 15px;
        }
      }

      &__header {
        background: transparent;
        border-bottom: 0;
      }

      &__day-name {
        font-family: Open Sans Bold;
        color: ${color.base.greyMid};
        margin: ${spacing(1)} ${spacing(1)} 0 ${spacing(1)};
        padding: ${spacing(2)};
        width: 34px;
        height: 34px;
        font-size: 14px;
      }

      &__day {
        color: ${color.theme.blue};
        font-size: 16px;
        padding: ${spacing(2)};
        margin: ${spacing(1)};
        width: 34px;
        height: 34px;
        line-height: 16px;

        &:hover {
          border-radius: 8px;
          background-color: ${color.base.greyLight};
        }

        &--selected,
        &--keyboard-selected {
          color: ${color.base.white};
          background-color: ${color.theme.blue};
          border-radius: 8px;
          font-family: Open Sans Bold;
        }

        &--outside-month {
          height: 0;
          background-color: transparent;

          &:hover {
            background: none;
          }
        }
      }
    }
  }
`;
