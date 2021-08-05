import React from 'react';

import colorPalette from '../../globals/color';
import IconLibrary, { Icons } from './assets';
import * as Styled from './Icon.styles';

export enum IconSize {
  small = 10,
  medium = 14,
  large = 18,
}

export interface IconProps {
  src: Icons;
  size?: IconSize;
  color?: string;
}

const Icon: React.FC<IconProps> = ({
  src,
  size = IconSize.small,
  color = colorPalette.theme.blue,
}) => {
  const Icon = IconLibrary[src];
  return (
    <Styled.Icon
      data-test="component-icon"
      style={{ width: `${size}px`, height: `${size}px`, color: color }}
    >
      <Icon />
    </Styled.Icon>
  );
};

export default Icon;
