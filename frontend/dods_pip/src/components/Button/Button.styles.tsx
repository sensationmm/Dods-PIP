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

type ButtonProps = {
  disabled: boolean;
};

const base = styled.button<ButtonProps>`
  font-family: 'Open Sans Bold';
  font-size: 16px;
  border-width: 1px;
  border-style: solid;
  width: 135px;
  padding: 0 ${spacing(4)};
  height: 40px;
  border-radius: 4px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  position: relative;
  width: 100%;

  &.inline {
    width: auto;
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
      padding-right: ${spacing(11)};

      ${Icon} {
        right: ${spacing(3)};
      }
    }
  }
`;

export const primary = styled(base)<ButtonProps>`
  color: ${color.base.white};
  border-color: ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyMid)}; 
  background ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyMid)};

  &:active,
  &:hover,
  &:focus {
    background-color: ${color.theme.blueDark};
    border-color: ${color.theme.blueDark};
  }
`;

export const secondary = styled(base)`
  color: ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyMid)};
  background-color: ${color.base.white};
  border-color: ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyMid)};

  &:active,
  &:hover,
  &:focus {
    background-color: ${color.shadow.grey};
  }
`;

export const text = styled(base)`
  color: ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyMid)};
  background-color: transparent;
  border-color: transparent;

  &:active,
  &:hover,
  &:focus {
    background-color: ${color.shadow.grey};
  }
`;
