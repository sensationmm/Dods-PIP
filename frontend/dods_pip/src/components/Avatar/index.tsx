import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Avatar.styles';

export type UserType = 'client' | 'consultant';
export type Size = 'large' | 'medium' | 'small';

export interface AvatarProps {
  type: UserType;
  size: Size;
  number?: number;
  disabled?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ type, size, number, disabled }) => {
  const fontSize = (size: Size) => {
    switch (size) {
      case 'large':
        return 'bodyLarge';
      case 'medium':
        return 'body';
      case 'small':
        return 'bodySmall';
    }
  };

  return (
    <Styled.wrapper data-test="component-avatar">
      <Styled.Background type={type} disabled={disabled} size={size}>
        {number ? (
          <Text color="white" type={fontSize(size)}>
            {`+${number}`}
          </Text>
        ) : (
          <Icon src={Icons.IconTick} size={IconSize[size]} color={color.base.white} />
        )}
      </Styled.Background>
    </Styled.wrapper>
  );
};

export default Avatar;
