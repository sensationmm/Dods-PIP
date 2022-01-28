import Image from 'next/image';
import React from 'react';

import { Icons, IconType } from './assets';
import * as Styled from './IconContentSource.styles';

export interface IconProps {
  icon?: IconType;
  width: number;
  height: number;
}

const IconContentSource: React.FC<IconProps> = ({ icon = 'Dods', height = 26, width = 26 }) => {
  const src = Icons[icon] || Icons.Dods;

  return (
    <Styled.IconContentSource data-test="component-icon">
      <Image src={src} alt="" width={width} height={height} unoptimized />
    </Styled.IconContentSource>
  );
};

export default IconContentSource;
