import React from 'react';

import color from '../../globals/color';
import Text from '../Text';
import * as Styled from './Badge.styles';

export type BadgeType =
  | 'infoLight'
  | 'infoGrey'
  | 'infoDark'
  | 'infoBlue'
  | 'confirm'
  | 'warn'
  | 'danger';
type sizes = 'medium' | 'small';

export interface BadgeProps {
  size?: sizes;
  type?: BadgeType;
  label?: string;
  number?: number;
}

const Badge: React.FC<BadgeProps> = ({ size, type = 'infoLight', label, number }) => {
  let Component = Styled.infoLight;

  switch (type) {
    case 'infoLight':
      Component = Styled.infoLight;
      break;
    case 'infoGrey':
      Component = Styled.infoGrey;
      break;
    case 'infoDark':
      Component = Styled.infoDark;
      break;
    case 'infoBlue':
      Component = Styled.infoBlue;
      break;
    case 'confirm':
      Component = Styled.confirm;
      break;
    case 'warn':
      Component = Styled.warn;
      break;
    case 'danger':
      Component = Styled.danger;
      break;
  }

  return (
    <Styled.wrapper data-test="badge-component">
      <Component data-test="badge" size={size}>
        <Text
          data-test="badge-number"
          bold
          type={size === 'small' ? 'bodySmall' : 'body'}
          color={type === 'infoLight' ? color.theme.blueMid : color.base.white}
        >
          {number || '--'}
        </Text>
      </Component>
      {label && label.length > 0 && (
        <Styled.textWrapper>
          <Text
            data-test-id="badge-label"
            type={size === 'small' ? 'bodySmall' : 'body'}
            color={color.base.greyDark}
          >
            {label}
          </Text>
        </Styled.textWrapper>
      )}
    </Styled.wrapper>
  );
};

export default Badge;
