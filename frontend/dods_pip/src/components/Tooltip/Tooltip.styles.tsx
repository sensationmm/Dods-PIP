import styled from 'styled-components';

import color from '../../globals/color';
import dropShadow from '../../globals/elevation';
import spacing from '../../globals/spacing';

export const wrapper = styled.div`
  position: relative;

  > span,
  > div {
    display: inline-block;
    cursor: pointer;
  }
`;

export const tooltipStyle = styled.div`
  display: block;
  opacity: 0;
  transition: opacity 0.5s;
  visibility: hidden;
  position: absolute;
  bottom: calc(100% + ${spacing(5)});
  left: ${spacing(-5)};
  max-width: ${spacing(70)};
  width: 100vw;

  ${wrapper}:focus &,
  ${wrapper}:hover & {
    opacity: 1;
    visibility: visible;
  }

  .inner {
    display: inline-block;
    background-color: ${color.base.white};
    border-radius: ${spacing(1)};
    box-shadow: ${dropShadow.dropShadow2};
    padding: ${spacing(3)};

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: ${color.base.white} transparent transparent transparent;
      left: ${spacing(5)};
      bottom: ${spacing(-5)};
    }

    p {
      display: flex;
      align-items: center;

      &:first-child {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: ${spacing(5)};
        position: relative;

        &::after {
          content: '';
          width: 100%;
          height: 2px;
          background-color: rgba(0, 0, 0, 0.1);
          position: absolute;
          bottom: ${spacing(-2.5)};
          left: 0;
        }
      }

      &:last-child {
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 0;

        &::after {
          display: none;
        }
      }

      > div {
        margin-right: ${spacing(2.5)};
      }
    }
  }

  &.alignTopRight {
    display: flex;
    justify-content: flex-end;
    left: auto;
    right: ${spacing(-5)};

    .inner {
      &::after {
        left: auto;
        right: ${spacing(5)};
      }
    }
  }

  &.alignRight {
    top: ${spacing(-2.5)};
    bottom: auto;
    left: calc(100% + ${spacing(5)});

    .inner {
      &::after {
        border-color: transparent ${color.base.white} transparent transparent;
        left: ${spacing(-5)};
        top: ${spacing(2.5)};
        bottom: auto;
      }
    }

    &.colorDark {
      .inner {
        &::after {
          border-color: transparent ${color.theme.blue} transparent transparent;
        }
      }
    }
  }

  &.alignLeft {
    display: flex;
    justify-content: flex-end;
    top: ${spacing(-2.5)};
    right: calc(100% + ${spacing(5)});
    bottom: auto;
    left: auto;

    .inner {
      &::after {
        border-color: transparent transparent transparent ${color.base.white};
        top: ${spacing(2.5)};
        right: ${spacing(-5)};
        bottom: auto;
        left: auto;
      }
    }

    &.colorDark {
      .inner {
        &::after {
          border-color: transparent transparent transparent ${color.theme.blue};
        }
      }
    }
  }

  &.colorLight {
    .inner {
      background-color: ${color.base.white};
    }
  }

  &.colorDark {
    .inner {
      background-color: ${color.theme.blue};

      &::after {
        border-color: ${color.theme.blue} transparent transparent transparent;
      }
    }
  }
`;
