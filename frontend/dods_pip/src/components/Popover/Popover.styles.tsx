import styled from 'styled-components'
import color from '../../globals/color'
import spacing from '../../globals/spacing'

export const popoverWrapper = styled.div`

  .btnTrigger {
    background-color: ${color.base.transparent};
    border: 0;
    cursor: pointer;
  }

  div[class^="Tooltipstyles__tooltipStyle"] {
    left: -12px;

    &:focus,
    &:hover {
      &.hover {
        opacity: 0;
        visibility: hidden;
      }
    }

    &.hover.show {
      opacity: 1;
      transition: opacity 0.5s;
      visibility: visible;
    }

    &.alignTopRight {
      left: auto;
      right: -12px;
    }

    &.right {
      left: 100%;
    }
  }
`