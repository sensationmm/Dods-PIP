import React from 'react';

import colorPalette from '../../globals/color';
import IconLibrary, { Icons } from './assets';
import * as Styled from './Icon.styles';

export enum IconSize {
  small = 10,
  medium = 14,
  mediumLarge = 16,
  large = 18,
  xlarge = 24,
  xxlarge = 30,
  xxxlarge = 60,
}

export interface IconProps {
  src: Icons;
  size?: IconSize;
  color?: string;
  alt?: string;
}

const Icon: React.FC<IconProps> = ({
  src,
  size = IconSize.small,
  color = colorPalette.theme.blue,
  alt,
}) => {
  const Icon = IconLibrary[src];
  return (
    <Styled.Icon
      data-test="component-icon"
      style={{ width: `${size}px`, height: `${size}px`, color: color }}
      title={alt}
    >
      <Icon />
    </Styled.Icon>
  );
};

export default Icon;
