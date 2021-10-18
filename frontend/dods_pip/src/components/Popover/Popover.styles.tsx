import styled from 'styled-components';

import color from '../../globals/color';

export const popoverWrapper = styled.div`
  .btnTrigger {
    background-color: ${color.base.transparent};
    border: 0;
    cursor: pointer;
  }

  div[class^='Tooltipstyles__tooltipStyle'] {
    left: -15px;

    &.popover {
      opacity: 0;
      transition: opacity 0.5s;
      visibility: hidden;
    }

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
