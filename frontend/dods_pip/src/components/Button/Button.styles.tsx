import styled from 'styled-components';

import color from '../../globals/color';
import spacing from '../../globals/spacing';
import { Icon } from '../Icon/Icon.styles';

export const wrapper = styled.div`
  @media (max-width: 599px) {
    display: flex;
    justify-content: center;
  }
`;

const base = styled.button`
  outline: 0;
  border-width: 1px;
  border-style: solid;
  width: 135px;
  padding: 0 ${spacing(4)};
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  width: 100%;

  &.inline {
    width: auto;
  }

  &.disabled {
    pointer-events: none;
  }

  &.small {
    height: 32px;
    font-size: 0.75em;
  }

  &.icon {
    text-align: left;

    ${Icon} {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    &.iconLeft {
      padding-left: ${spacing(11)};

      ${Icon} {
        left: ${spacing(3)};
      }
    }

    &.iconRight {
      ${Icon} {
        right: ${spacing(3)};
      }
    }
  }
`;

export const primary = styled(base)`
  color: ${color.base.white};
  background-color: ${color.theme.blueMid};
  border-color: ${color.theme.blueMid};

  &:hover,
  &:focus {
    background-color: ${color.theme.blueDark};
    border-color: ${color.theme.blueDark};
  }

  &.disabled {
    background-color: ${color.shadow.grey};
    border-color: ${color.shadow.grey};
  }
`;

export const secondary = styled(base)`
  color: ${color.theme.blueMid};
  background-color: ${color.base.white};
  border-color: ${color.theme.blueMid};

  &:hover,
  &:focus {
    background-color: ${color.shadow.grey};
  }

  &.disabled {
    color: ${color.shadow.grey};
    border-color: ${color.shadow.grey};
  }
`;

export const text = styled(base)`
  color: ${color.theme.blueMid};
  background-color: transparent;
  border-color: transparent;

  &:hover,
  &:focus {
    background-color: ${color.shadow.grey};
  }

  &.disabled {
    color: ${color.shadow.grey};
  }
`;
