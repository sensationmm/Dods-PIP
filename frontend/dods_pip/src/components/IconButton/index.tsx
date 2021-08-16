import classNames from 'classnames';
import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import * as Styled from './IconButton.styles';

export interface IconButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon?: Icons;
}

const IconButton: React.FC<IconButtonProps> = ({ label, onClick, disabled = false, icon }) => {
  return (
    <div data-test="component-icon-button">
      <Styled.button
        className={classNames({
          disabled: disabled,
          icon: icon,
        })}
        onClick={onClick}
      >
        {label}
        {icon && !label && <Icon src={icon} size={IconSize.medium} color={color.base.white} />}
      </Styled.button>
    </div>
  );
};

export default IconButton;
