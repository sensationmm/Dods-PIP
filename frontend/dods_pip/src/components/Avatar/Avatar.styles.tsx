import styled from 'styled-components';

import color from '../../globals/color';
import { AvatarProps, Size, UserType } from '.';

export const wrapper = styled.div``;

export const clientBackgroundColor = `linear-gradient(180deg, ${color.accent.yellow} 0%, ${color.accent.orange} 100%)`;
export const consultantBackgroundColor = `linear-gradient(180deg, ${color.theme.blueLight} 0%, ${color.theme.blue} 100%);`;

const backgroundColor = (typeOfClient: UserType) => {
  return typeOfClient === 'client' ? clientBackgroundColor : consultantBackgroundColor;
};

const backgroundSize = (size: Size) => {
  switch (size) {
    case 'large':
      return '80px';
    case 'medium':
      return '48px';
    case 'small':
      return '24px';
  }
};

export const Background = styled.div<AvatarProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: ${(props) => backgroundSize(props.size as Size)};
  width: ${(props) => backgroundSize(props.size as Size)};
  background: ${(props) => (props.disabled ? color.shadow.grey : backgroundColor(props.type))};
`;
