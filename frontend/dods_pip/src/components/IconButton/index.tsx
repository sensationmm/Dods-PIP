import classNames from 'classnames';
import React from 'react';

import color from '../../globals/color';
import { ButtonProps } from '../Button';
import * as Styled from '../Button/Button.styles';
import Icon, { IconSize } from '../Icon';

export interface IconButtonProps extends Omit<ButtonProps, 'iconAlignment' | 'inline' | 'width'> {}

const IconButton: React.FC<IconButtonProps> = ({
  label,
  onClick,
  disabled = false,
  icon,
  type = 'primary',
  isSmall = false,
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
    <div data-test="component-icon-button">
      <Component
        isIconButton
        width="fixed"
        disabled={disabled}
        className={classNames({
          small: isSmall,
          icon: icon,
        })}
        onClick={onClick}
      >
        {label}
        {icon && !label && (
          <Icon
            src={icon}
            size={
              isSmall
                ? type !== 'text'
                  ? IconSize.medium
                  : IconSize.mediumLarge
                : type !== 'text'
                ? IconSize.large
                : IconSize.xlarge
            }
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
    </div>
  );
};

export default IconButton;
