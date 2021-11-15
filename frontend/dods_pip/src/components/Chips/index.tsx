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
}

const Chips: React.FC<ChipsProps> = ({
  chipsSize = 'dense',
  label,
  value = '',
  disabled,
  icon,
  avatarType,
  onCloseClick,
}) => {
  const [hovering, setHovering] = React.useState<boolean>(false);
  const [active, setActive] = React.useState<boolean>(false);

  return (
    <Styled.wrapper
      iconOrAvatar={icon || avatarType ? true : false}
      data-test="component-chip"
      selected={active}
      disabled={disabled}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Styled.contentWrapper data-test="content-wrapper" onClick={() => setActive(true)}>
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
            selected={active}
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
      <Styled.closeButton
        data-test="close-button"
        selected={active}
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
    </Styled.wrapper>
  );
};

export default Chips;
