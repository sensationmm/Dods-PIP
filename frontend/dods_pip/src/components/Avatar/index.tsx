import React, { useEffect, useState } from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text, { TextStyles } from '../Text';
import * as Styled from './Avatar.styles';

export type UserType = 'client' | 'consultant';
export type Size = 'large' | 'medium' | 'small';
export type IconSizes = keyof typeof IconSize;
export interface AvatarProps {
  type: UserType;
  size: Size;
  number?: number;
  disabled?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ type, size, number, disabled }) => {
  const [iconSize, setIconSize] = useState<IconSizes>('xlarge');
  const [fontSize, setFontSize] = useState<TextStyles>('body');
  useEffect(() => {
    ((size: Size) => {
      switch (size) {
        case 'large':
          setIconSize('xlarge');
          setFontSize('bodyLarge');
          break;
        case 'medium':
          setIconSize('medium');
          setFontSize('body');
          break;
        case 'small':
          setIconSize('small');
          setFontSize('bodySmall');
          break;
      }
    })(size);
  }, [size]);

  return (
    <Styled.wrapper data-test="component-avatar">
      <Styled.Background type={type} disabled={disabled} size={size}>
        {number && !disabled ? (
          <Text color="white" type={fontSize}>
            {`+${number}`}
          </Text>
        ) : (
          <Icon
            src={Icons.IconAvatar}
            size={IconSize[iconSize]}
            color={disabled ? color.base.grey : color.base.white}
          />
        )}
      </Styled.Background>
    </Styled.wrapper>
  );
};

export default Avatar;
