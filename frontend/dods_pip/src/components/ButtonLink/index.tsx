import classNames from 'classnames';
import React from 'react';

import color from '../../globals/color';
import { ButtonProps } from '../Button';
import * as StyledButton from '../Button/Button.styles';
import Icon, { IconSize } from '../Icon';
import * as Styled from './ButtonLink.styles';

export interface ButtonLinkProps extends Omit<ButtonProps, 'onClick'> {
  href: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({
  type = 'primary',
  width = 'auto',
  label,
  href,
  disabled = false,
  isSmall = false,
  icon,
  iconAlignment = 'left',
  inline = false,
}) => {
  let Component = StyledButton.primary;

  switch (type) {
    case 'primary':
      Component = StyledButton.primary;
      break;
    case 'secondary':
      Component = StyledButton.secondary;
      break;
    case 'text':
      Component = StyledButton.text;
      break;
  }

  return (
    <StyledButton.wrapper data-test="component-button">
      <Styled.a href={href}>
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
      </Styled.a>
    </StyledButton.wrapper>
  );
};

export default ButtonLink;
