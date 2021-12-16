import React from 'react';

import color from '../../globals/color';
import Avatar, { UserType } from '../Avatar';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Chips.styles';

export type ChipsSize = 'dense' | 'medium';
export interface ChipsProps {
  chipsSize?: ChipsSize;
  icon?: Icons;
  label: string;
  value?: string;
  disabled?: boolean;
  avatarType?: UserType;
  onCloseClick?: (val: string) => void;
  theme?: 'dark' | 'light';
  hasFlash?: boolean;
}

const Chips: React.FC<ChipsProps> = ({
  chipsSize = 'dense',
  label,
  value = '',
  disabled,
  icon,
  avatarType,
  onCloseClick,
  theme = 'light',
  hasFlash = false,
}) => {
  const [hovering, setHovering] = React.useState<boolean>(false);

  const isClickable = onCloseClick !== undefined;

  return (
    <Styled.wrapper
      iconOrAvatar={icon || avatarType ? true : false}
      data-test="component-chip"
      clickable={isClickable}
      disabled={disabled}
      theme={theme}
      onMouseEnter={() => isClickable && setHovering(true)}
      onMouseLeave={() => isClickable && setHovering(false)}
      flash={hasFlash}
    >
      <Styled.contentWrapper data-test="content-wrapper">
        {avatarType && !icon && (
          <Styled.avatarWrapper>
            <Avatar
              data-test="avatar-component"
              disabled={disabled}
              type={avatarType}
              size={chipsSize === 'medium' ? 'medium' : 'small'}
            />
          </Styled.avatarWrapper>
        )}
        {icon && (
          <Styled.iconWrapper
            size={chipsSize}
            hovering={hovering}
            disabled={disabled}
            // selected={active}
            data-test="left-icon-wrapper"
          >
            <Icon
              data-test="left-icon"
              src={icon}
              size={chipsSize === 'medium' ? IconSize.large : IconSize.small}
              color={disabled ? color.base.grey : color.theme.blue}
            />
          </Styled.iconWrapper>
        )}
        <Text
          data-test="chips-label"
          type={chipsSize === 'medium' ? 'body' : 'bodySmall'}
          bold
          color={disabled ? color.base.greyDark : color.theme.blue}
        >
          {label}
        </Text>
      </Styled.contentWrapper>
      {isClickable && (
        <Styled.closeButton
          data-test="close-button"
          disabled={disabled}
          hovering={hovering}
          onClick={() => onCloseClick?.(value === '' ? label : value)}
        >
          <Icon
            src={Icons.CrossBold}
            size={IconSize.small}
            color={color.base.white}
            data-test="closeButtonIcon"
          />
        </Styled.closeButton>
      )}
    </Styled.wrapper>
  );
};

export default Chips;
