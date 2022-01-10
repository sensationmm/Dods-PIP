import Image from 'next/image';
import React from 'react';

import { Icons, IconType } from './assets';
import * as Styled from './IconContentSource.styles';

export interface IconProps {
  icon?: IconType;
}

const IconContentSource: React.FC<IconProps> = ({ icon }) => {
  const src = Icons[icon || 'Dods'];

  return (
    <Styled.IconContentSource data-test="component-icon">
      <Image src={src} alt="" width="26" height="26" />
    </Styled.IconContentSource>
  );
};

export default IconContentSource;
