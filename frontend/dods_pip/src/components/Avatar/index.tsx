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
  size?: Size;
  number?: number;
  disabled?: boolean;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({ type, size = 'medium', number, disabled, alt }) => {
  const [iconSize, setIconSize] = useState<IconSizes>('xxxlarge');
  const [fontSize, setFontSize] = useState<TextStyles>('bodyLarge');
  useEffect(() => {
    ((size: Size) => {
      switch (size) {
        case 'large':
          setIconSize('xxxlarge');
          setFontSize('bodyLarge');
          break;
        case 'medium':
          setIconSize('xxlarge');
          setFontSize('body');
          break;
        case 'small':
          setIconSize('large');
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
            src={Icons.Avatar}
            size={IconSize[iconSize]}
            color={disabled ? color.base.grey : color.base.white}
            alt={alt}
          />
        )}
      </Styled.Background>
    </Styled.wrapper>
  );
};

export default Avatar;
