import styled from 'styled-components';

import color from '../../globals/color';
import elevation from '../../globals/elevation';
import spacing from '../../globals/spacing';
import { Icon } from '../Icon/Icon.styles';

export const wrapper = styled.div`
  @media (max-width: 599px) {
    display: flex;
    justify-content: center;
  }
`;

type ButtonProps = {
  isIconButton?: boolean;
  disabled: boolean;
  width: string;
};

const base = styled.button<ButtonProps>`
  font-family: 'Open Sans Bold';
  font-size: 16px;
  border-width: 1px;
  border-style: solid;
  width: ${({ width, isIconButton }) =>
    !isIconButton ? (width === 'auto' ? '100%' : width === 'full' ? '100%' : '140px') : '40px'};
  padding: ${({ isIconButton }) => (!isIconButton ? `0 ${spacing(4)}` : '0')};
  height: 40px;
  border-radius: 8px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  position: relative;
  box-shadow: ${({ disabled }) => (!disabled ? elevation.selectShadow : 'none')};
  display: ${({ width }) => (width === 'auto' ? 'block' : 'flex')};
  justify-content: center;
  align-items: center;

  &.inline {
    width: auto;
  }

  &.small {
    height: 32px;
    font-size: 12px;

    ${({ isIconButton }) => isIconButton && `width: 32px;`}
  }

  &.icon {
    ${({ width }) =>
      width === 'auto'
        ? `
      text-align: left;

      ${Icon} {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

      &.iconLeft {
        padding-left: ${spacing(11)};

        ${Icon} {
          left: ${spacing(4)};
        }
      }

      &.iconRight {
        padding-right: ${spacing(11)};

        ${Icon} {
          right: ${spacing(4)};
        }
      }
    `
        : `
    &.iconLeft {
      flex-direction: row-reverse;

      ${Icon} {
        margin-right: ${spacing(3)};
      }
    }

    &.iconRight {
      ${Icon} {
        margin-left: ${spacing(3)};
      }
    }
    `};
  }
`;

export const primary = styled(base)<ButtonProps>`
  color: ${({ disabled }) => (!disabled ? color.base.white : color.base.greyDark)}; 
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
  color: ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyDark)};
  background ${({ disabled }) => (!disabled ? color.base.white : color.base.greyLight)};
  border-color: ${({ disabled }) => (!disabled ? color.base.greyLight : color.base.greyLight)};

  &:active,
  &:hover,
  &:focus {
    background-color: ${color.shadow.blue};
  }
`;

export const text = styled(base)`
  color: ${({ disabled }) => (!disabled ? color.theme.blueMid : color.base.greyDark)};
  background-color: transparent;
  border-color: transparent;
  box-shadow: none;

  &:active,
  &:hover,
  &:focus {
    background-color: ${color.shadow.blue};
  }
`;
