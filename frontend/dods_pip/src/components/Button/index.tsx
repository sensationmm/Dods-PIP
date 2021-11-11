import classNames from 'classnames';
import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import * as Styled from './Button.styles';

export type ButtonType = 'primary' | 'secondary' | 'text';
type ButtonWidth = 'auto' | 'fixed';
type IconAlignment = 'left' | 'right';

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  isSmall?: boolean;
  type?: ButtonType;
  icon?: Icons;
  iconAlignment?: IconAlignment;
  inline?: boolean;
  width?: ButtonWidth;
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  width = 'auto',
  label,
  onClick,
  disabled = false,
  isSmall = false,
  icon,
  iconAlignment = 'left',
  inline = false,
}) => {
  let Component = Styled.primary;

  switch (type) {
    case 'primary':
      Component = Styled.primary;
      break;
    case 'secondary':
      Component = Styled.secondary;
      break;
    case 'text':
      Component = Styled.text;
      break;
  }

  return (
    <Styled.wrapper data-test="component-button">
      <Component
        isIconButton={false}
        disabled={disabled}
        width={width}
        className={classNames({
          small: isSmall,
          icon: icon,
          iconLeft: icon && iconAlignment === 'left',
          iconRight: icon && iconAlignment === 'right',
          inline: inline,
        })}
        onClick={onClick}
      >
        {label}
        {icon && (
          <Icon
            src={icon}
            size={isSmall ? IconSize.medium : IconSize.large}
            color={
              type === 'primary'
                ? !disabled
                  ? color.base.white
                  : color.base.greyDark
                : !disabled
                ? color.theme.blueMid
                : color.base.greyDark
            }
          />
        )}
      </Component>
    </Styled.wrapper>
  );
};

export default Button;
