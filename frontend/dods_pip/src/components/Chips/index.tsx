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
  selected?: boolean;
  disabled?: boolean;
  avatarType?: UserType;
  onClick?: () => void;
  onCloseClick?: () => void;
}

const Chips: React.FC<ChipsProps> = ({
  chipsSize = 'dense',
  label,
  disabled,
  selected,
  icon,
  avatarType,
  onClick,
  onCloseClick,
}) => {
  const [hovering, setHovering] = React.useState(false);

  return (
    <Styled.wrapper
      data-test="component-chip"
      selected={selected}
      disabled={disabled}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Styled.contentWrapper onClick={onClick}>
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
            selected={selected}
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
          color={disabled ? color.base.grey : color.theme.blueMid}
        >
          {label}
        </Text>
      </Styled.contentWrapper>
      {hovering && (
        <Styled.closeButton disabled={disabled} onClick={onCloseClick}>
          <Icon
            src={Icons.IconCross}
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
