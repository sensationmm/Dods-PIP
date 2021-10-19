import styled from 'styled-components';

import color from '../../globals/color';
import { tooltipStyle, wrapper } from '../Tooltip/Tooltip.styles';

export const popoverWrapper = styled.div`
  .btnTrigger {
    background-color: ${color.base.transparent};
    border: 0;
    cursor: pointer;
  }

  ${wrapper} {
    &:focus,
    &:hover {
      ${tooltipStyle} {
        opacity: 0;
        visibility: hidden;

        &.show {
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }

  ${tooltipStyle} {
    left: -15px;
    opacity: 0;
    transition: opacity 0.5s;
    visibility: hidden;

    &.show {
      opacity: 1;
      visibility: visible;
    }

    &.alignTopRight {
      left: auto;
      right: -15px;
    }

    &.alignRight {
      left: 100%;
      margin-left: 15px;
    }
  }
`;
