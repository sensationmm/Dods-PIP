import classNames from 'classnames';
import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import * as Styled from './Button.styles';

type ButtonType = 'primary' | 'secondary' | 'text';
type IconAlignment = 'left' | 'right';

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  isSmall?: boolean;
  type?: ButtonType;
  icon?: Icons;
  iconAlignment?: IconAlignment;
  inline?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
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
        className={classNames({
          disabled: disabled,
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
            color={type === 'primary' ? color.base.white : color.theme.blueMid}
          />
        )}
      </Component>
    </Styled.wrapper>
  );
};

export default Button;
