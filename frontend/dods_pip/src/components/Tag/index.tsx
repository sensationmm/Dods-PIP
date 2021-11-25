import React from 'react';

import color from '../../globals/color';
import Icon, { IconSize } from '../Icon';
import { Icons } from '../Icon/assets';
import Text from '../Text';
import * as Styled from './Tag.styles';

export type Size = 'small' | 'medium';
export interface TagProps {
  size?: Size;
  icon?: Icons;
  iconColor?: string;
  iconBgColor?: string;
  iconBorderColor?: string;
  label: string;
  width?: 'fixed' | 'auto';
  bgColor?: string;
}

const Tag: React.FC<TagProps> = ({
  size = 'medium',
  label,
  icon,
  width = 'auto',
  iconBgColor = color.theme.blue,
  iconBorderColor = 'transparent',
  iconColor = color.base.white,
  bgColor,
}) => {
  return (
    <Styled.wrapper bgColor={bgColor} data-test="component-tag" width={width} size={size}>
      {icon && (
        <Styled.iconWrapper
          size={size}
          data-test="left-icon-wrapper"
          css={{ backgroundColor: iconBgColor, borderColor: iconBorderColor }}
        >
          <Icon
            data-test="left-icon"
            src={icon}
            size={size === 'medium' ? IconSize.large : IconSize.small}
            color={iconColor}
          />
        </Styled.iconWrapper>
      )}
      <Styled.textWrapper data-test="content-wrapper">
        <Text
          data-test="chips-label"
          type={size === 'medium' ? 'body' : 'bodySmall'}
          bold
          color={color.theme.blue}
          center
        >
          {label}
        </Text>
      </Styled.textWrapper>
    </Styled.wrapper>
  );
};

export default Tag;
